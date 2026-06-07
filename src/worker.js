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
  renderAdminComments,
  renderErrorPage,
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
      if (pathname === '/auth/github' || pathname === '/api/auth/github') {
        return handleGithubAuthRedirect(request, env);
      }

      // ==================== 管理后台 ====================
      if (pathname.startsWith('/admin/') || pathname === '/admin') {
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
      return html(renderErrorPage('zh-CN', env, 404, ''), 404);
    } catch (err) {
      console.error('Worker error:', err);
      return html(renderErrorPage('zh-CN', env, 500, err.message), 500);
    }
  },
};

// ===========================================================================
// 页面路由处理
// ===========================================================================

async function handlePageRequest(request, env, locale, subPath) {
  const url = new URL(request.url);
  const path = subPath.replace(/^\//, '') || '';
  const PAGE_SIZE = 9;

  if (path === '' || path === '/') {
    const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
    const articles = await getPublishedArticles(env, locale);
    const totalPages = Math.ceil(articles.length / PAGE_SIZE);
    const paged = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return html(renderHome(locale, env, paged, page, totalPages));
  }

  if (path === 'articles' || path === 'articles/') {
    const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
    const q = (url.searchParams.get('q') || '').trim();
    let articles = await getPublishedArticles(env, locale);
    if (q) {
      const kw = q.toLowerCase();
      articles = articles.filter(a => {
        const t = (a.title || '').toLowerCase();
        const c = (a.content || '').toLowerCase();
        const g = (a.tags || []).join(' ').toLowerCase();
        const s = (a.summary || '').toLowerCase();
        return t.includes(kw) || c.includes(kw) || g.includes(kw) || s.includes(kw);
      });
    }
    const totalPages = Math.ceil(articles.length / PAGE_SIZE);
    const paged = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return html(renderArticleList(locale, env, paged, page, totalPages, q));
  }

  if (path === 'about' || path === 'about/') {
    return html(renderAbout(locale, env));
  }

  // RSS feed
  if (path === 'rss.xml') {
    return await handleRssFeed(request, env, locale);
  }

  const articleMatch = path.match(/^articles\/(.+)$/);
  if (articleMatch) {
    const articleId = articleMatch[1];
    const article = await getArticle(env, articleId);
    if (!article) {
      return html(renderErrorPage(locale, env, 404, ''), 404);
    }
    const comments = await getComments(env, articleId);
    return html(renderArticle(locale, env, article, comments));
  }

  return html(renderErrorPage(locale, env, 404, ''), 404);
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

  // 评论管理页面
  if (pathname.startsWith('/admin/comments')) {
    const url = new URL(request.url);
    const articleId = url.searchParams.get('articleId');
    if (!articleId) {
      return html(renderAdminComments(env, null, []));
    }
    const article = await getArticle(env, articleId);
    const comments = await getComments(env, articleId);
    return html(renderAdminComments(env, article, comments));
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

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

// ===========================================================================
// RSS Feed
// ===========================================================================

async function handleRssFeed(request, env, locale) {
  const articles = await getPublishedArticles(env, locale);
  const siteName = env.SITE_NAME || '我的博客';
  const origin = new URL(request.url).origin;
  const prefix = locale === 'zh-TW' ? '/tw' : '/cn';

  let items = '';
  for (const article of articles.slice(0, 20)) {
    const date = article.createdAt ? new Date(article.createdAt).toUTCString() : '';
    const url = `${origin}${prefix}/articles/${article.id}`;
    const summary = article.summary || (article.content || '').substring(0, 200);
    items += `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${summary}]]></description>
      <pubDate>${date}</pubDate>
    </item>`;
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${siteName}</title>
  <link>${origin}${prefix}/</link>
  <description>${siteName} - ${locale === 'zh-TW' ? '部落格文章' : '博客文章'}</description>
  <language>${locale}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${origin}${prefix}/rss.xml" rel="self" type="application/rss+xml"/>
  ${items}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml;charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
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
