/**
 * 认证中间件
 * 提供管理员 session 验证和 GitHub OAuth token 验证功能
 */

/**
 * 验证管理员 session token
 * 从 cookie 中读取 admin_session，并在 SESSIONS_KV 中验证
 * @param {Request} request - 请求对象
 * @param {Object} env - 环境变量与 KV 绑定
 * @returns {Promise<boolean>} - 验证是否通过
 */
export async function verifyAdmin(request, env) {
  try {
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies['admin_session'];

    if (!sessionToken) {
      return false;
    }

    // 在 SESSIONS_KV 中查找 session
    const sessionData = await env.SESSIONS_KV.get(`admin_session:${sessionToken}`, { type: 'json' });

    if (!sessionData) {
      return false;
    }

    // 检查 session 是否过期
    if (sessionData.expiresAt && new Date(sessionData.expiresAt) < new Date()) {
      // 清除过期 session
      await env.SESSIONS_KV.delete(`admin_session:${sessionToken}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error('verifyAdmin error:', err);
    return false;
  }
}

/**
 * 创建管理员 session
 * 生成 session token 并存入 SESSIONS_KV，有效期 24 小时
 * @param {Object} env - 环境变量与 KV 绑定
 * @returns {Promise<string>} - 返回生成的 session token
 */
export async function createAdminSession(env) {
  const token = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 小时后过期

  const sessionData = {
    token,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  await env.SESSIONS_KV.put(`admin_session:${token}`, JSON.stringify(sessionData), {
    expirationTtl: 86400, // 24 小时 = 86400 秒
  });

  return token;
}

/**
 * 验证 GitHub OAuth token
 * 从 Authorization header 或查询参数中获取 token，并在 SESSIONS_KV 中验证
 * @param {Request} request - 请求对象
 * @param {Object} env - 环境变量与 KV 绑定
 * @returns {Promise<boolean>} - 验证是否通过
 */
export async function verifyGithubToken(request, env) {
  try {
    let token = null;

    // 尝试从 Authorization header 获取
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // 尝试从查询参数获取
    if (!token) {
      const url = new URL(request.url);
      token = url.searchParams.get('github_token');
    }

    if (!token) {
      return false;
    }

    // 在 SESSIONS_KV 中查找 GitHub token
    const sessionData = await env.SESSIONS_KV.get(`github:${token}`, { type: 'json' });

    if (!sessionData) {
      return false;
    }

    // 可选：验证 GitHub token 仍然有效
    try {
      const verifyResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!verifyResponse.ok) {
        // Token 已失效，清除 session
        await env.SESSIONS_KV.delete(`github:${token}`);
        return false;
      }
    } catch (e) {
      // 网络错误时仍然信任 KV 中的记录
      console.warn('GitHub token verification request failed, trusting KV session:', e);
    }

    return true;
  } catch (err) {
    console.error('verifyGithubToken error:', err);
    return false;
  }
}

/**
 * 解析 Cookie 字符串为对象
 * @param {string} cookieString - Cookie 头字符串
 * @returns {Object} - 键值对形式的 Cookie 对象
 */
function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) return cookies;

  cookieString.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name.trim()] = rest.join('=').trim();
    }
  });

  return cookies;
}
