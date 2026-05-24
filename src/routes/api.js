/**
 * API 路由处理器
 * 处理所有 /api/ 开头的请求
 */

import { verifyAdmin, createAdminSession, verifyGithubToken } from '../middleware/auth.js';
import { getAnalytics } from '../utils/analytics.js';

/**
 * 处理 API 请求
 */
export async function handleApiRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  try {
    // ==================== 管理员登录 ====================
    if (method === 'POST' && pathname === '/api/admin/login') {
      return await handleAdminLogin(request, env, headers);
    }

    // ==================== 文章 CRUD ====================

    // 创建文章（需认证）
    if (method === 'POST' && pathname === '/api/admin/articles') {
      if (!(await verifyAdmin(request, env))) {
        return jsonResponse({ error: 'Unauthorized' }, 401, headers);
      }
      return await handleCreateArticle(request, env, headers);
    }

    // 更新文章（需认证）
    if (method === 'PUT' && matchRoute(pathname, '/api/admin/articles/:id')) {
      if (!(await verifyAdmin(request, env))) {
        return jsonResponse({ error: 'Unauthorized' }, 401, headers);
      }
      const id = extractId(pathname, '/api/admin/articles/');
      return await handleUpdateArticle(request, env, id, headers);
    }

    // 删除文章（需认证）
    if (method === 'DELETE' && matchRoute(pathname, '/api/admin/articles/:id')) {
      if (!(await verifyAdmin(request, env))) {
        return jsonResponse({ error: 'Unauthorized' }, 401, headers);
      }
      const id = extractId(pathname, '/api/admin/articles/');
      return await handleDeleteArticle(env, id, headers);
    }

    // ==================== 公开文章接口 ====================

    // 获取文章列表
    if (method === 'GET' && pathname === '/api/articles') {
      return await handleGetArticles(request, env, headers);
    }

    // 获取单篇文章
    if (method === 'GET' && matchRoute(pathname, '/api/articles/:id')) {
      const id = extractId(pathname, '/api/articles/');
      return await handleGetArticle(env, id, headers);
    }

    // ==================== 评论 ====================

    // 提交评论（需 GitHub OAuth）
    if (method === 'POST' && matchRoute(pathname, '/api/comments/:articleId')) {
      if (!(await verifyGithubToken(request, env))) {
        return jsonResponse({ error: '请先登录 GitHub' }, 401, headers);
      }
      const articleId = extractId(pathname, '/api/comments/');
      return await handleCreateComment(request, env, articleId, headers);
    }

    // 获取文章评论
    if (method === 'GET' && matchRoute(pathname, '/api/comments/:articleId')) {
      const articleId = extractId(pathname, '/api/comments/');
      return await handleGetComments(env, articleId, headers);
    }

    // ==================== GitHub OAuth ====================

    // GitHub OAuth 回调
    if (method === 'GET' && pathname === '/api/auth/github/callback') {
      return await handleGithubOAuthCallback(request, env, headers);
    }

    // 获取 GitHub 用户信息
    if (method === 'GET' && pathname === '/api/auth/github/user') {
      return await handleGetGithubUser(request, env, headers);
    }

    // ==================== 统计 ====================

    // 获取访问统计
    if (method === 'GET' && pathname === '/api/stats') {
      return await handleGetStats(env, headers);
    }

    // 404
    return jsonResponse({ error: 'API endpoint not found' }, 404, headers);
  } catch (err) {
    console.error('API error:', err);
    return jsonResponse({ error: 'Internal Server Error' }, 500, headers);
  }
}

// ===========================================================================
// 路由辅助函数
// ===========================================================================

function matchRoute(pathname, pattern) {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');
  if (patternParts.length !== pathParts.length) return false;
  return patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
}

function extractId(pathname, prefix) {
  return pathname.slice(prefix.length).split('/')[0] || '';
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

// ===========================================================================
// 处理函数
// ===========================================================================

/**
 * 管理员登录
 */
async function handleAdminLogin(request, env, headers) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return jsonResponse({ error: '请输入用户名和密码' }, 400, headers);
    }

    if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
      const token = await createAdminSession(env);
      return jsonResponse({ success: true, token }, 200, headers);
    }

    return jsonResponse({ error: '用户名或密码错误' }, 401, headers);
  } catch (e) {
    return jsonResponse({ error: '请求格式错误' }, 400, headers);
  }
}

/**
 * 创建文章
 */
async function handleCreateArticle(request, env, headers) {
  try {
    const body = await request.json();
    const { title, content, tags, locale, published, summary } = body;

    if (!title || !content) {
      return jsonResponse({ error: '标题和内容不能为空' }, 400, headers);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const article = {
      id,
      title,
      content,
      summary: summary || content.substring(0, 150),
      tags: tags || [],
      locale: locale || 'zh-CN',
      published: published !== false,
      createdAt: now,
      updatedAt: now,
    };

    // 存储文章
    await env.ARTICLES_KV.put(`article:${id}`, JSON.stringify(article));

    // 更新索引
    await updateArticleIndex(env, {
      id,
      title,
      locale: article.locale,
      published: article.published,
      createdAt: now,
    });

    return jsonResponse({ success: true, article }, 201, headers);
  } catch (e) {
    console.error('Create article error:', e);
    return jsonResponse({ error: '创建失败' }, 500, headers);
  }
}

/**
 * 更新文章
 */
async function handleUpdateArticle(request, env, id, headers) {
  try {
    const existing = await env.ARTICLES_KV.get(`article:${id}`, { type: 'json' });
    if (!existing) {
      return jsonResponse({ error: '文章不存在' }, 404, headers);
    }

    const body = await request.json();
    const updated = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      content: body.content !== undefined ? body.content : existing.content,
      summary: body.summary !== undefined ? body.summary : existing.summary,
      tags: body.tags !== undefined ? body.tags : existing.tags,
      locale: body.locale !== undefined ? body.locale : existing.locale,
      published: body.published !== undefined ? body.published : existing.published,
      updatedAt: new Date().toISOString(),
    };

    await env.ARTICLES_KV.put(`article:${id}`, JSON.stringify(updated));

    // 更新索引
    await updateArticleIndex(env, {
      id,
      title: updated.title,
      locale: updated.locale,
      published: updated.published,
      createdAt: updated.createdAt,
    });

    return jsonResponse({ success: true, article: updated }, 200, headers);
  } catch (e) {
    console.error('Update article error:', e);
    return jsonResponse({ error: '更新失败' }, 500, headers);
  }
}

/**
 * 删除文章
 */
async function handleDeleteArticle(env, id, headers) {
  try {
    const existing = await env.ARTICLES_KV.get(`article:${id}`, { type: 'json' });
    if (!existing) {
      return jsonResponse({ error: '文章不存在' }, 404, headers);
    }

    await env.ARTICLES_KV.delete(`article:${id}`);
    await removeFromArticleIndex(env, id);

    return jsonResponse({ success: true }, 200, headers);
  } catch (e) {
    console.error('Delete article error:', e);
    return jsonResponse({ error: '删除失败' }, 500, headers);
  }
}

/**
 * 获取文章列表（公开）
 */
async function handleGetArticles(request, env, headers) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'zh-CN';
    const tag = url.searchParams.get('tag');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const indexData = await env.ARTICLES_KV.get('article_index', { type: 'json' });
    if (!indexData || !Array.isArray(indexData)) {
      return jsonResponse({ articles: [], total: 0 }, 200, headers);
    }

    let filtered = indexData.filter(item => item.published && item.locale === locale);
    if (tag) {
      filtered = filtered.filter(item => item.tags && item.tags.includes(tag));
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    // 获取完整文章内容
    const articles = [];
    for (const item of paged) {
      const full = await env.ARTICLES_KV.get(`article:${item.id}`, { type: 'json' });
      if (full) articles.push(full);
    }

    return jsonResponse({ articles, total, page, limit }, 200, headers);
  } catch (e) {
    console.error('Get articles error:', e);
    return jsonResponse({ error: '获取失败' }, 500, headers);
  }
}

/**
 * 获取单篇文章（公开）
 */
async function handleGetArticle(env, id, headers) {
  const article = await env.ARTICLES_KV.get(`article:${id}`, { type: 'json' });
  if (!article) {
    return jsonResponse({ error: '文章不存在' }, 404, headers);
  }
  return jsonResponse(article, 200, headers);
}

/**
 * 创建评论
 */
async function handleCreateComment(request, env, articleId, headers) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return jsonResponse({ error: '评论内容不能为空' }, 400, headers);
    }

    // 获取 GitHub 用户信息
    const authHeader = request.headers.get('Authorization');
    let token = authHeader ? authHeader.replace('Bearer ', '') : null;
    if (!token) {
      const url = new URL(request.url);
      token = url.searchParams.get('github_token');
    }

    const sessionData = await env.SESSIONS_KV.get(`github:${token}`, { type: 'json' });
    if (!sessionData || !sessionData.username) {
      return jsonResponse({ error: '无效的 GitHub 凭据' }, 401, headers);
    }

    const comment = {
      id: crypto.randomUUID(),
      articleId,
      content: content.trim(),
      username: sessionData.username,
      avatarUrl: sessionData.avatarUrl || '',
      createdAt: new Date().toISOString(),
    };

    // 获取现有评论列表
    const existing = await env.COMMENTS_KV.get(`comments:${articleId}`, { type: 'json' }) || [];
    existing.push(comment);
    await env.COMMENTS_KV.put(`comments:${articleId}`, JSON.stringify(existing));

    return jsonResponse({ success: true, comment }, 201, headers);
  } catch (e) {
    console.error('Create comment error:', e);
    return jsonResponse({ error: '评论失败' }, 500, headers);
  }
}

/**
 * 获取文章评论
 */
async function handleGetComments(env, articleId, headers) {
  try {
    const comments = await env.COMMENTS_KV.get(`comments:${articleId}`, { type: 'json' }) || [];
    return jsonResponse(comments, 200, headers);
  } catch (e) {
    return jsonResponse([], 200, headers);
  }
}

/**
 * GitHub OAuth 回调
 */
async function handleGithubOAuthCallback(request, env, headers) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return new Response('OAuth authorization code missing', { status: 400 });
    }

    // 用 code 换取 access_token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error('GitHub OAuth token exchange failed:', tokenData);
      return new Response('GitHub OAuth failed', { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // 获取 GitHub 用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const userData = await userResponse.json();

    if (!userData.login) {
      console.error('GitHub user fetch failed:', userData);
      return new Response('Failed to get GitHub user info', { status: 400 });
    }

    // 将 GitHub 用户信息存入 SESSIONS_KV
    const sessionToken = crypto.randomUUID();
    const sessionData = {
      token: accessToken,
      username: userData.login,
      avatarUrl: userData.avatar_url || '',
      createdAt: new Date().toISOString(),
    };

    await env.SESSIONS_KV.put(`github:${sessionToken}`, JSON.stringify(sessionData), {
      expirationTtl: 604800, // 7 天
    });

    // 重定向回评论页面，带上 token
    const redirectUrl = new URL(request.url).origin + '/cn/?github_token=' + sessionToken;
    return Response.redirect(redirectUrl, 302);
  } catch (e) {
    console.error('GitHub OAuth callback error:', e);
    return new Response('OAuth callback error', { status: 500 });
  }
}

/**
 * 获取 GitHub 用户信息（给前端评论使用）
 */
async function handleGetGithubUser(request, env, headers) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return jsonResponse({ error: 'Token required' }, 400, headers);
    }

    const sessionData = await env.SESSIONS_KV.get(`github:${token}`, { type: 'json' });
    if (!sessionData) {
      return jsonResponse({ error: 'Invalid token' }, 401, headers);
    }

    return jsonResponse({
      login: sessionData.username,
      avatar_url: sessionData.avatarUrl,
    }, 200, headers);
  } catch (e) {
    return jsonResponse({ error: 'Failed' }, 500, headers);
  }
}

/**
 * 获取访问统计
 */
async function handleGetStats(env, headers) {
  try {
    const stats = await getAnalytics(env);
    return jsonResponse(stats, 200, headers);
  } catch (e) {
    console.error('Get stats error:', e);
    return jsonResponse({ pageViews: 0, visitors: 0, requests: 0, dailyData: [] }, 200, headers);
  }
}

// ===========================================================================
// 索引维护辅助函数
// ===========================================================================

/**
 * 更新文章索引
 */
async function updateArticleIndex(env, articleInfo) {
  let indexData = await env.ARTICLES_KV.get('article_index', { type: 'json' });
  if (!Array.isArray(indexData)) {
    indexData = [];
  }

  // 移除旧的同 id 记录
  indexData = indexData.filter(item => item.id !== articleInfo.id);
  // 添加新记录
  indexData.push(articleInfo);

  await env.ARTICLES_KV.put('article_index', JSON.stringify(indexData));
}

/**
 * 从索引中移除文章
 */
async function removeFromArticleIndex(env, articleId) {
  let indexData = await env.ARTICLES_KV.get('article_index', { type: 'json' });
  if (!Array.isArray(indexData)) return;

  indexData = indexData.filter(item => item.id !== articleId);
  await env.ARTICLES_KV.put('article_index', JSON.stringify(indexData));
}
