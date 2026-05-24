/**
 * Cloudflare Worker 主入口文件
 * 处理所有 fetch 请求，进行 URL 路由分发
 */

import { handleApiRequest } from './routes/api.js';
import { getAnalytics } from './utils/analytics.js';
import {
  renderHome,
  renderArticle,
  renderArticleList,
  renderAbout,
  renderAdminLogin,
  renderAdminDashboard,
  renderAdminEditor,
} from './templates/pages.js';
import { verifyAdmin } from './middleware/auth.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    try {
      // ==================== API 路由 ====================
      if (pathname.startsWith('/api/')) {
        return await handleApiRequest(request, env, ctx);
      }

      // ==================== GitHub OAuth 发起 ====================
      if (pathname === '/auth/github') {
        return handleGithubAuthRedirect(request, env);
      }

      // ==================== 管理后台 ====================
      if (pathname.startsWith('/admin/')) {
        return await handleAdminRequest(request, env, pathname);
      }

      // ==================== 简体中文页面 (/cn/...) ====================
      if (pathname.startsWith('/cn/')) {
        return await handlePageRequest(request, env, 'zh-CN', pathname.slice(3));
      }

      // ==================== 繁体中文页面 (/tw/...) ====================
      if (pathname.startsWith('/tw/')) {
        return await handlePageRequest(request, env, 'zh-TW', pathname.slice(3));
      }

      // ==================== 根路径重定向 ====================
      if (pathname === '/' || pathname === '') {
        return Response.redirect(new URL('/cn/', request.url).href, 302);
      }

      // 其他未匹配路由 → 404
      return new Response('Not Found', { status: 404 });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

// ===========================================================================
// 页面路由处理
// ===========================================================================

async function handlePageRequest(request, env, locale, subPath) {
  const path = subPath.replace(/^\//, '') || '';

  if (path === '' || path === '/') {
    const articles = await getPublishedArticles(env, locale);
    return html(renderHome(locale, env, articles));
  }

  if (path === 'articles' || path === 'articles/') {
    const articles = await getPublishedArticles(env, locale);
    return html(renderArticleList(locale, env, articles));
  }

  if (path === 'about' || path === 'about/') {
    return html(renderAbout(locale, env));
  }

  const articleMatch = path.match(/^articles\/(.+)$/);
  if (articleMatch) {
    const articleId = articleMatch[1];
    const article = await getArticle(env, articleId);
    if (!article) {
      return new Response('Not Found', { status: 404 });
    }
    const comments = await getComments(env, articleId);
    return html(renderArticle(locale, env, article, comments));
  }

  return new Response('Not Found', { status: 404 });
}

async function handleAdminRequest(request, env, pathname) {
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return html(renderAdminLogin(env));
  }

  const isAdmin = await verifyAdmin(request, env);
  if (!isAdmin) {
    return Response.redirect(new URL('/admin/login', request.url).href, 302);
  }

  if (pathname === '/admin/' || pathname === '/admin') {
    const articles = await getAllArticles(env);
    let stats = {};
    try {
      stats = await getAnalytics(env);
    } catch (e) {
      console.error('Analytics error:', e);
    }
    return html(renderAdminDashboard(env, articles, stats));
  }

  if (pathname === '/admin/editor' || pathname === '/admin/editor/') {
    const url = new URL(request.url);
    const articleId = url.searchParams.get('id');
    let article = null;
    if (articleId) {
      article = await getArticle(env, articleId);
    }
    return html(renderAdminEditor(env, article));
  }

  return new Response('Not Found', { status: 404 });
}

function handleGithubAuthRedirect(request, env) {
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('GitHub OAuth not configured', { status: 500 });
  }

  const redirectUri = `${new URL(request.url).origin}/api/auth/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user,user:email`;

  return Response.redirect(githubAuthUrl, 302);
}

// ===========================================================================
// KV 数据读取辅助
// ===========================================================================

async function getPublishedArticles(env, locale) {
  try {
    const indexData = await env.ARTICLES_KV.get('article_index', { type: 'json' });
    if (!indexData || !Array.isArray(indexData)) return [];

    const articles = [];
    for (const item of indexData) {
      if (item.published && item.locale === locale) {
        const full = await env.ARTICLES_KV.get(`article:${item.id}`, { type: 'json' });
        if (full) articles.push(full);
      }
    }
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return articles;
  } catch (e) {
    console.error('getPublishedArticles error:', e);
    return [];
  }
}

async function getAllArticles(env) {
  try {
    const indexData = await env.ARTICLES_KV.get('article_index', { type: 'json' });
    if (!indexData || !Array.isArray(indexData)) return [];

    const articles = [];
    for (const item of indexData) {
      const full = await env.ARTICLES_KV.get(`article:${item.id}`, { type: 'json' });
      if (full) articles.push(full);
    }
    articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return articles;
  } catch (e) {
    console.error('getAllArticles error:', e);
    return [];
  }
}

async function getArticle(env, id) {
  try {
    return await env.ARTICLES_KV.get(`article:${id}`, { type: 'json' });
  } catch (e) {
    return null;
  }
}

async function getComments(env, articleId) {
  try {
    const data = await env.COMMENTS_KV.get(`comments:${articleId}`, { type: 'json' });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

// ===========================================================================
// 工具函数
// ===========================================================================

function html(content) {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}
