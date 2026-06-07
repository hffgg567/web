/**
 * 页面渲染器 - Personal Website
 * 所有页面渲染函数，使用内联的 CSS/JS 模板
 */

import { CSS } from '../static/style-css.js';
import { APP_JS } from '../static/app-js.js';

// ---------------------------------------------------------------------------
// i18n Texts (for template rendering)
// ---------------------------------------------------------------------------

const I18N = {
  'zh-CN': {
    siteName: '我的博客',
    navHome: '首页',
    navArticles: '文章',
    navAbout: '关于',
    heroTitle: '欢迎来到我的博客',
    heroSubtitle: '在这里分享技术、思考与生活',
    heroCta: '阅读文章',
    recentArticles: '最新文章',
    publishedOn: '发布于',
    tags: '标签',
    about: '关于我',
    aboutContent: '你好！我是一名热爱技术的开发者。在这个博客里，我会分享关于编程、开源项目和技术思考的文章。欢迎与我交流！',
    comments: '评论',
    loginHint: '请先登录 GitHub 后评论',
    submitComment: '提交评论',
    login: '登录',
    loginSubtitle: '请输入管理员凭据',
    username: '用户名',
    password: '密码',
    loginButton: '登录',
    adminDashboard: '管理后台',
    adminArticles: '文章管理',
    adminNewArticle: '新建文章',
    adminEditArticle: '编辑文章',
    adminTitle: '标题',
    adminDate: '日期',
    adminStatus: '状态',
    adminActions: '操作',
    adminEdit: '编辑',
    adminDelete: '删除',
    adminStats: '统计',
    published: '已发布',
    draft: '草稿',
    editorTitle: '标题',
    editorTags: '标签（逗号分隔）',
    editorLocale: '语言',
    editorPublished: '发布',
    editorSave: '保存',
    editorPreview: '预览',
    editorEdit: '编辑',
    noArticles: '暂无文章',
    noComments: '暂无评论，来发表第一条吧！',
    socialGithub: 'GitHub',
    socialTwitter: 'Twitter',
    socialEmail: 'Email',
    pageViews: '浏览量',
    visitors: '访客数',
    requests: '请求数',
    logout: '退出登录',
    loginWithGithub: '使用 GitHub 登录',
    writeComment: '写下你的评论...',
  },
  'zh-TW': {
    siteName: '我的部落格',
    navHome: '首頁',
    navArticles: '文章',
    navAbout: '關於',
    heroTitle: '歡迎來到我的部落格',
    heroSubtitle: '在這裡分享技術、思考與生活',
    heroCta: '閱讀文章',
    recentArticles: '最新文章',
    publishedOn: '發佈於',
    tags: '標籤',
    about: '關於我',
    aboutContent: '你好！我是一名熱愛技術的開發者。在這個部落格裡，我會分享關於程式設計、開源專案和技術思考的文章。歡迎與我交流！',
    comments: '留言',
    loginHint: '請先登入 GitHub 後留言',
    submitComment: '送出留言',
    login: '登入',
    loginSubtitle: '請輸入管理員憑證',
    username: '使用者名稱',
    password: '密碼',
    loginButton: '登入',
    adminDashboard: '管理後台',
    adminArticles: '文章管理',
    adminNewArticle: '新建文章',
    adminEditArticle: '編輯文章',
    adminTitle: '標題',
    adminDate: '日期',
    adminStatus: '狀態',
    adminActions: '操作',
    adminEdit: '編輯',
    adminDelete: '刪除',
    adminStats: '統計',
    published: '已發佈',
    draft: '草稿',
    editorTitle: '標題',
    editorTags: '標籤（逗號分隔）',
    editorLocale: '語言',
    editorPublished: '發佈',
    editorSave: '儲存',
    editorPreview: '預覽',
    editorEdit: '編輯',
    noArticles: '暫無文章',
    noComments: '暫無留言，來發表第一條吧！',
    socialGithub: 'GitHub',
    socialTwitter: 'Twitter',
    socialEmail: 'Email',
    pageViews: '瀏覽量',
    visitors: '訪客數',
    requests: '請求數',
    logout: '退出登入',
    loginWithGithub: '使用 GitHub 登入',
    writeComment: '寫下你的留言...',
  },
};

function tt(locale, key) {
  const texts = I18N[locale] || I18N['zh-CN'];
  return texts[key] || key;
}

function getPrefix(locale) {
  return locale === 'zh-TW' ? '/tw' : '/cn';
}

function getLangActive(locale, lang) {
  return (locale === lang) ? 'lang-switch__btn--active' : '';
}

function getNavActive(currentPage, targetPage) {
  return (currentPage === targetPage) ? 'navbar__link--active' : '';
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Pagination Helper
// ---------------------------------------------------------------------------

function renderPagination(locale, prefix, page, totalPages, searchQuery = '') {
  if (totalPages <= 1) return '';
  let html = '<nav class="pagination" style="display:flex;justify-content:center;align-items:center;gap:6px;margin-top:32px;flex-wrap:wrap;">';
  const qs = searchQuery ? '&q=' + encodeURIComponent(searchQuery) : '';
  
  html += page > 1
    ? '<a href="' + prefix + '/articles?page=' + (page - 1) + qs + '" class="pagination__link" style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;text-decoration:none;color:var(--text-primary);background:var(--bg-secondary);">' + (locale === 'zh-TW' ? '‹ 上一頁' : '‹ 上一页') + '</a>'
    : '<span class="pagination__link" style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;color:var(--text-disabled);background:var(--bg-secondary);opacity:0.5;">' + (locale === 'zh-TW' ? '‹ 上一頁' : '‹ 上一页') + '</span>';
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === page) {
      html += '<span class="pagination__link pagination__active" style="padding:8px 14px;border:1px solid var(--accent-primary);border-radius:6px;background:var(--accent-primary);color:#fff;font-weight:700;">' + i + '</span>';
    } else if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
      html += '<a href="' + prefix + '/articles?page=' + i + qs + '" class="pagination__link" style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;text-decoration:none;color:var(--text-primary);background:var(--bg-secondary);">' + i + '</a>';
    } else if (Math.abs(i - page) === 3) {
      html += '<span style="padding:8px 6px;color:var(--text-tertiary);">...</span>';
    }
  }
  
  html += page < totalPages
    ? '<a href="' + prefix + '/articles?page=' + (page + 1) + qs + '" class="pagination__link" style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;text-decoration:none;color:var(--text-primary);background:var(--bg-secondary);">' + (locale === 'zh-TW' ? '下一頁 ›' : '下一页 ›') + '</a>'
    : '<span class="pagination__link" style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;color:var(--text-disabled);background:var(--bg-secondary);opacity:0.5;">' + (locale === 'zh-TW' ? '下一頁 ›' : '下一页 ›') + '</span>';
  
  html += '</nav>';
  return html;
}

// -
// Simple Markdown to HTML
// ---------------------------------------------------------------------------

function markdownToHtml(text) {
  if (!text) return '';
  let html = escapeHtml(text);
  // Code blocks
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => { const langAttr = lang ? ' data-lang="' + lang + '"' : ''; return '<pre' + langAttr + '><code>' + code.trim() + '</code></pre>'; });
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  // Unordered lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  // Paragraphs
  html = html.replace(/^(?!<[hbluo]|<li|<pre|<hr|<block)(.+)$/gm, '<p>$1</p>');
  return html;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---------------------------------------------------------------------------
// Fill Base Template
// ---------------------------------------------------------------------------

function fillBaseTemplate(params) {
  const siteName = params.siteName || tt(params.locale, 'siteName');
  const prefix = getPrefix(params.locale);
  const canonicalUrl = params.canonicalUrl || '';
  const ogImage = params.ogImage || '';

  return `<!DOCTYPE html>
<html lang="${params.locale}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(params.description || '')}">
  <meta name="keywords" content="${escapeHtml(params.keywords || '')}">
  <meta name="theme-color" content="#228be6">
  <meta name="color-scheme" content="light dark">
  <title>${escapeHtml(params.title || siteName)} - ${escapeHtml(siteName)}</title>
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${params.ogType || 'website'}">
  <meta property="og:title" content="${escapeHtml(params.ogTitle || params.title || siteName)}">
  <meta property="og:description" content="${escapeHtml(params.description || '')}">
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  ${canonicalUrl ? `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">` : ''}
  ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : ''}
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(params.ogTitle || params.title || siteName)}">
  <meta name="twitter:description" content="${escapeHtml(params.description || '')}">
  ${ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}">` : ''}
  <!-- Canonical -->
  ${canonicalUrl ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">` : ''}
  <!-- RSS -->
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(siteName)} RSS Feed" href="${prefix}/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body class="${params.bodyClass || ''}">
  <!-- Navigation -->
  <nav class="navbar">
    <div class="navbar__inner">
      <a href="${prefix}/" class="navbar__logo">${siteName}</a>

      <ul class="navbar__links">
        <li><a href="${prefix}/" class="navbar__link ${getNavActive(params.currentPage, 'home')}">${tt(params.locale, 'navHome')}</a></li>
        <li><a href="${prefix}/articles" class="navbar__link ${getNavActive(params.currentPage, 'articles')}">${tt(params.locale, 'navArticles')}</a></li>
        <li><a href="${prefix}/about" class="navbar__link ${getNavActive(params.currentPage, 'about')}">${tt(params.locale, 'navAbout')}</a></li>
      </ul>

      <div class="navbar__actions">
        <div class="lang-switch">
          <button class="lang-switch__btn ${getLangActive(params.locale, 'zh-CN')}" onclick="switchLang('cn')">CN</button>
          <button class="lang-switch__btn ${getLangActive(params.locale, 'zh-TW')}" onclick="switchLang('tw')">TW</button>
        </div>
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
          <span class="icon-sun">☀️</span>
          <span class="icon-moon">🌙</span>
        </button>
        <button class="hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
          <span class="hamburger__line"></span>
          <span class="hamburger__line"></span>
          <span class="hamburger__line"></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div class="mobile-menu" id="mobileMenu">
    <a href="${prefix}/" class="mobile-menu__link ${getNavActive(params.currentPage, 'home')}">${tt(params.locale, 'navHome')}</a>
    <a href="${prefix}/articles" class="mobile-menu__link ${getNavActive(params.currentPage, 'articles')}">${tt(params.locale, 'navArticles')}</a>
    <a href="${prefix}/about" class="mobile-menu__link ${getNavActive(params.currentPage, 'about')}">${tt(params.locale, 'navAbout')}</a>
    <div class="mobile-menu__actions">
      <div class="lang-switch">
        <button class="lang-switch__btn ${getLangActive(params.locale, 'zh-CN')}" onclick="switchLang('cn')">CN</button>
        <button class="lang-switch__btn ${getLangActive(params.locale, 'zh-TW')}" onclick="switchLang('tw')">TW</button>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
        <span class="icon-sun">☀️</span>
        <span class="icon-moon">🌙</span>
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <main class="main-content">
    ${params.content || ''}
  </main>

  <!-- Footer -->
  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
  </footer>

  <script>${APP_JS}</script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Page Renderers
// ---------------------------------------------------------------------------

/**
 * 渲染首页
 */
export function renderHome(locale, env, articles, page = 1, totalPages = 1) {
  const siteName = env.SITE_NAME || tt(locale, 'siteName');
  const prefix = getPrefix(locale);

  // Build article cards
  let articlesHtml = '';
  if (articles && articles.length > 0) {
    articlesHtml = articles.map(article => {
      const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'zh-CN') : '';
      const tagsHtml = (article.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
      return `
        <a href="${prefix}/articles/${article.id}" class="article-card">
          <h3 class="article-card__title">${escapeHtml(article.title)}</h3>
          <div class="article-card__meta">${tt(locale, 'publishedOn')} ${date}</div>
          <p class="article-card__excerpt">${escapeHtml(article.summary || article.content?.substring(0, 150) || '')}</p>
          <div class="article-card__tags">${tagsHtml}</div>
        </a>`;
    }).join('');
  } else {
    articlesHtml = `<p style="text-align:center;color:var(--text-tertiary);grid-column:1/-1;">${tt(locale, 'noArticles')}</p>`;
  }

  const content = `
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">${tt(locale, 'heroTitle')}</h1>
        <p class="hero__subtitle">${tt(locale, 'heroSubtitle')}</p>
        <a href="${prefix}/articles" class="hero__cta">${tt(locale, 'heroCta')}</a>
      </div>
    </section>
    <section class="container">
      <h2 style="font-size:1.3rem;font-weight:700;margin-top:20px;">${tt(locale, 'recentArticles')}</h2>
      <div class="articles-grid">
        ${articlesHtml}
      </div>
      ${renderPagination(locale, prefix, page, totalPages)}
      <div style="text-align:center;margin-top:16px;">
        <a href="${prefix}/articles" style="color:var(--accent-primary);font-weight:600;">${locale === 'zh-TW' ? '查看全部文章 →' : '查看全部文章 →'}</a>
      </div>
    </section>`;

  return fillBaseTemplate({
    locale,
    title: tt(locale, 'siteName'),
    siteName,
    description: tt(locale, 'heroSubtitle'),
    content,
    currentPage: 'home',
  });
}

/**
 * 渲染文章详情页
 */
export function renderArticle(locale, env, article, comments) {
  const siteName = env.SITE_NAME || tt(locale, 'siteName');
  const prefix = getPrefix(locale);

  const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'zh-CN') : '';
  const tagsHtml = (article.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join(' ');

  // Build comments HTML
  let commentsHtml = '';
  if (comments && comments.length > 0) {
    const items = comments.map(c => {
      const cDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'zh-CN') : '';
      return `
        <li class="comment-item">
          <img src="${c.avatarUrl || 'https://github.githubassets.com/images/gravatars/gravatar-user-420.png'}" alt="${escapeHtml(c.username)}" class="comment-item__avatar">
          <div class="comment-item__body">
            <div class="comment-item__header">
              <span class="comment-item__author">${escapeHtml(c.username)}</span>
              <span class="comment-item__date">${cDate}</span>
            </div>
            <div class="comment-item__content">${escapeHtml(c.content)}</div>
          </div>
        </li>`;
    }).join('');
    commentsHtml = `<ul class="comment-list">${items}</ul>`;
  } else {
    commentsHtml = `<p class="no-comments">${tt(locale, 'noComments')}</p>`;
  }

  const content = `
    <article class="article-detail container container--narrow">
      <h1 class="article-detail__title">${escapeHtml(article.title)}</h1>
      <div class="article-detail__meta">
        <span>${tt(locale, 'publishedOn')} ${date}</span>
        <span class="article-card__tags">${tagsHtml}</span>
      </div>
      <div class="article-detail__content">
        ${markdownToHtml(article.content || '')}
      </div>
    </article>

    <section class="comments-section container container--narrow">
      <h2 class="comments-section__title">${tt(locale, 'comments')} (${comments ? comments.length : 0})</h2>
      <div class="comment-form">
        <div class="comment-form__actions">
          <button id="githubLoginBtn" class="comment-form__login-btn">${tt(locale, 'loginWithGithub')}</button>
          <span id="githubUserInfo" style="display:none;"></span>
        </div>
        <form id="commentForm" data-article-id="${article.id}">
          <textarea id="commentContent" class="comment-form__textarea" placeholder="${tt(locale, 'writeComment')}" required></textarea>
          <div class="comment-form__actions" style="margin-top:12px;">
            <span style="font-size:0.85rem;color:var(--text-tertiary);">${tt(locale, 'loginHint')}</span>
            <button type="submit" id="commentSubmit" class="comment-form__submit" disabled>${tt(locale, 'submitComment')}</button>
          </div>
        </form>
      </div>
      ${commentsHtml}
    </section>`;

  return fillBaseTemplate({
    locale,
    title: article.title,
    siteName,
    description: article.summary || '',
    content,
    currentPage: 'articles',
  });
}

/**
 * 渲染文章列表页
 */
export function renderArticleList(locale, env, articles, page = 1, totalPages = 1, searchQuery = '') {
  const siteName = env.SITE_NAME || tt(locale, 'siteName');
  const prefix = getPrefix(locale);

  let articlesHtml = '';
  if (articles && articles.length > 0) {
    articlesHtml = articles.map(article => {
      const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'zh-CN') : '';
      const tagsHtml = (article.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
      return `
        <a href="${prefix}/articles/${article.id}" class="article-card">
          <h3 class="article-card__title">${escapeHtml(article.title)}</h3>
          <div class="article-card__meta">${tt(locale, 'publishedOn')} ${date}</div>
          <p class="article-card__excerpt">${escapeHtml(article.summary || article.content?.substring(0, 150) || '')}</p>
          <div class="article-card__tags">${tagsHtml}</div>
        </a>`;
    }).join('');
  } else {
    articlesHtml = `<p style="text-align:center;color:var(--text-tertiary);grid-column:1/-1;">${tt(locale, 'noArticles')}</p>`;
  }

  const content = `
    <section class="container" style="padding-top:32px;">
      <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:16px;">${tt(locale, 'navArticles')}</h1>
      <form class="search-bar" action="${prefix}/articles" method="GET" style="margin-bottom:24px;display:flex;gap:8px;max-width:500px;">
        <input type="text" name="q" value="${escapeHtml(searchQuery)}" placeholder="${locale === 'zh-TW' ? '搜尋文章...' : '搜索文章...'}" 
               style="flex:1;padding:10px 16px;border:2px solid var(--border-color);border-radius:8px;font-size:1rem;background:var(--bg-secondary);color:var(--text-primary);outline:none;">
        <button type="submit" style="padding:10px 20px;background:var(--accent-primary);color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;">
          ${locale === 'zh-TW' ? '搜尋' : '搜索'}
        </button>
      </form>
      ${searchQuery ? `<p style="margin-bottom:16px;color:var(--text-tertiary);">${locale === 'zh-TW' ? '搜尋' : '搜索'}「${escapeHtml(searchQuery)}」${locale === 'zh-TW' ? '的結果' : '的结果'}</p>` : ''}
      <div class="articles-grid">
        ${articlesHtml}
      </div>
      ${renderPagination(locale, prefix, page, totalPages, searchQuery)}
    </section>`;

  return fillBaseTemplate({
    locale,
    title: tt(locale, 'navArticles'),
    siteName,
    content,
    currentPage: 'articles',
  });
}

/**
 * 渲染关于页面
 */
export function renderAbout(locale, env) {
  const siteName = env.SITE_NAME || tt(locale, 'siteName');

  const content = `
    <section class="about-page">
      <div class="about-page__avatar">👤</div>
      <h1 class="about-page__title">${tt(locale, 'about')}</h1>
      <p class="about-page__content">${tt(locale, 'aboutContent')}</p>
      <div class="about-page__socials">
        <a href="https://github.com" class="about-page__social-link">${tt(locale, 'socialGithub')}</a>
        <a href="https://twitter.com" class="about-page__social-link">${tt(locale, 'socialTwitter')}</a>
        <a href="mailto:hello@example.com" class="about-page__social-link">${tt(locale, 'socialEmail')}</a>
      </div>
    </section>`;

  return fillBaseTemplate({
    locale,
    title: tt(locale, 'about'),
    siteName,
    content,
    currentPage: 'about',
  });
}

/**
 * 渲染管理员登录页
 */
export function renderAdminLogin(env) {
  const siteName = env.SITE_NAME || '我的博客';

  const html = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>登录 - ${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-card__title">🔐 管理后台</h1>
      <p class="login-card__subtitle">请输入管理员凭据</p>
      <div id="loginError" class="login-card__error"></div>
      <form id="loginForm">
        <div class="login-card__field">
          <label class="login-card__label" for="loginUsername">用户名</label>
          <input class="login-card__input" type="text" id="loginUsername" name="username" autocomplete="username" required>
        </div>
        <div class="login-card__field">
          <label class="login-card__label" for="loginPassword">密码</label>
          <input class="login-card__input" type="password" id="loginPassword" name="password" autocomplete="current-password" required>
        </div>
        <button type="submit" class="login-card__button">登录</button>
      </form>
    </div>
  </div>
  <script>${APP_JS}</script>
</body>
</html>`;

  return html;
}

/**
 * 渲染管理后台首页（文章列表 + 统计）
 */
export function renderAdminDashboard(env, articles, stats) {
  const siteName = env.SITE_NAME || '我的博客';

  // Stats cards
  const statsHtml = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card__value">${stats?.pageViews || 0}</div>
        <div class="stat-card__label">浏览量</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${stats?.visitors || 0}</div>
        <div class="stat-card__label">访客数</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${stats?.requests || 0}</div>
        <div class="stat-card__label">请求数</div>
      </div>
    </div>`;

  // Articles table
  let tableRows = '';
  if (articles && articles.length > 0) {
    tableRows = articles.map(article => {
      const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '';
      const status = article.published ? '<span style="color:var(--accent-green);">已发布</span>' : '<span style="color:var(--accent-orange);">草稿</span>';
      return `
        <tr data-article-id="${article.id}" data-title="${escapeHtml(article.title)}">
          <td><strong>${escapeHtml(article.title)}</strong></td>
          <td>${date}</td>
          <td>${status}</td>
          <td>
            <div class="admin-table__actions">
              <a href="/admin/editor?id=${article.id}" class="btn btn--sm">编辑</a>
              <button onclick="togglePublish('${article.id}', ${article.published})" class="btn btn--sm">${article.published ? '取消发布' : '发布'}</button>
              <a href="/admin/comments?articleId=${article.id}" class="btn btn--sm">评论</a>
              <button onclick="deleteArticle('${article.id}')" class="btn btn--sm btn--danger">删除</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  } else {
    tableRows = '<tr><td colspan="4" style="text-align:center;color:var(--text-tertiary);">暂无文章</td></tr>';
  }

  const html = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>管理后台 - ${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  <nav class="navbar">
    <div class="navbar__inner">
      <a href="/admin/" class="navbar__logo">${siteName} - 管理后台</a>
      <div class="navbar__actions">
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
          <span class="icon-sun">☀️</span>
          <span class="icon-moon">🌙</span>
        </button>
        <a href="/cn/" class="btn btn--sm">返回网站</a>
        <button onclick="document.cookie='admin_session=;path=/;max-age=0';window.location.href='/admin/login';" class="btn btn--sm btn--danger">退出登录</button>
      </div>
    </div>
  </nav>

  <div class="admin-layout">
    <aside class="admin-sidebar">
      <ul class="admin-sidebar__nav">
        <li><button class="admin-sidebar__item admin-sidebar__item--active">📊 仪表盘</button></li>
        <li><a href="/admin/editor" class="admin-sidebar__item">✏️ 新建文章</a></li>
      </ul>
    </aside>
    <div class="admin-content">
      <h1 class="admin-content__title">仪表盘</h1>
      ${statsHtml}
      <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:16px;">文章管理</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  </div>

  <script>${APP_JS}</script>
</body>
</html>`;

  return html;
}

/**
 * 渲染文章编辑器（新建/编辑）
 */
export function renderAdminEditor(env, article) {
  const siteName = env.SITE_NAME || '我的博客';
  const isEdit = !!article;
  const articleId = article?.id || '';

  const html = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEdit ? '编辑文章' : '新建文章'} - ${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  <nav class="navbar">
    <div class="navbar__inner">
      <a href="/admin/" class="navbar__logo">${siteName} - 管理后台</a>
      <div class="navbar__actions">
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
          <span class="icon-sun">☀️</span>
          <span class="icon-moon">🌙</span>
        </button>
        <a href="/admin/" class="btn btn--sm">返回列表</a>
      </div>
    </div>
  </nav>

  <div class="admin-layout">
    <div class="admin-content" style="max-width:900px;">
      <h1 class="admin-content__title">${isEdit ? '编辑文章' : '新建文章'}</h1>
      <div class="editor">
        <div class="editor__field">
          <label class="editor__label" for="editorTitle">标题</label>
          <input class="editor__input" type="text" id="editorTitle" value="${isEdit ? escapeHtml(article.title) : ''}" placeholder="文章标题">
        </div>
        <div class="editor__field">
          <label class="editor__label" for="editorTags">标签（逗号分隔）</label>
          <input class="editor__input" type="text" id="editorTags" value="${isEdit ? (article.tags || []).join(', ') : ''}" placeholder="技术, 编程, 随笔">
        </div>
        <div style="display:flex;gap:16px;">
          <div class="editor__field" style="flex:1;">
            <label class="editor__label" for="editorLocale">语言</label>
            <select class="editor__input" id="editorLocale">
              <option value="zh-CN" ${!isEdit || article.locale === 'zh-CN' ? 'selected' : ''}>简体中文</option>
              <option value="zh-TW" ${isEdit && article.locale === 'zh-TW' ? 'selected' : ''}>繁体中文</option>
            </select>
          </div>
          <div class="editor__field">
            <label class="editor__label">&nbsp;</label>
            <div class="editor__checkbox">
              <input type="checkbox" id="editorPublished" ${!isEdit || article.published ? 'checked' : ''}>
              <span>发布</span>
            </div>
          </div>
        </div>
        <div class="editor__tabs">
          <button class="editor__tab editor__tab--active" id="tabEdit">编辑</button>
          <button class="editor__tab" id="tabPreview">预览</button>
        </div>
        <textarea class="editor__textarea" id="editorContent" placeholder="使用 Markdown 编写文章内容...">${isEdit ? escapeHtml(article.content || '') : ''}</textarea>
        <div class="editor__preview" id="editorPreview" style="display:none;"></div>
        <div class="editor__actions">
          <button id="editorSave" class="btn btn--primary" data-article-id="${articleId}">${isEdit ? '更新文章' : '发布文章'}</button>
        </div>
      </div>
    </div>
  </div>

  <script>${APP_JS}</script>
</body>
</html>`;

  return html;
}

// ---------------------------------------------------------------------------
// 评论管理页面
// ---------------------------------------------------------------------------

export function renderAdminComments(env, article, comments) {
  const siteName = env.SITE_NAME || '我的博客';
  
  let commentsHtml = '';
  if (!article) {
    commentsHtml = '<p style="text-align:center;color:var(--text-tertiary);padding:40px;">请从文章管理页面点击「评论」按钮进入</p>';
  } else if (!comments || comments.length === 0) {
    commentsHtml = '<p style="text-align:center;color:var(--text-tertiary);padding:40px;">该文章暂无评论</p>';
  } else {
    commentsHtml = comments.map(function(c) {
      var d = c.createdAt ? new Date(c.createdAt).toLocaleDateString('zh-CN') : '';
      var avatar = c.avatarUrl || 'https://github.githubassets.com/images/gravatars/gravatar-user-420.png';
      return '<li class="comment-item" style="list-style:none;padding:12px 0;border-bottom:1px solid var(--border-color);">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;">'
        + '<div style="display:flex;align-items:center;gap:10px;">'
        + '<img src="' + avatar + '" alt="" style="width:32px;height:32px;border-radius:50%;">'
        + '<div><strong style="color:var(--text-primary);">' + escapeHtml(c.username) + '</strong>'
        + '<span style="display:block;font-size:0.8rem;color:var(--text-tertiary);">' + d + '</span></div>'
        + '</div>'
        + '<button data-delete-comment="' + c.id + '" data-delete-article="' + c.articleId + '" class="btn btn--sm btn--danger comment-delete-btn">删除</button>'
        + '</div>'
        + '<p style="margin:8px 0 0 42px;color:var(--text-secondary);">' + escapeHtml(c.content) + '</p>'
        + '</li>';
    }).join('');
    commentsHtml = '<ul style="padding:0;margin:0;">' + commentsHtml + '</ul>';
  }

  var title = article ? '评论管理：' + escapeHtml(article.title) : '评论管理';

  return '<!DOCTYPE html>\n<html lang="zh-CN" data-theme="light">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + title + ' - ' + siteName + '</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n  <style>' + CSS + '</style>\n</head>\n<body>\n  <nav class="navbar">\n    <div class="navbar__inner">\n      <a href="/admin/" class="navbar__logo">' + siteName + ' - 管理后台</a>\n      <div class="navbar__actions">\n        <button class="theme-toggle" onclick="toggleTheme()"><span class="icon-sun">☀️</span><span class="icon-moon">🌙</span></button>\n      </div>\n    </div>\n  </nav>\n  <div style="max-width:800px;margin:80px auto 0;padding:20px;">\n    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:20px;">' + title + '</h1>\n    <a href="/admin/" style="display:inline-block;margin-bottom:20px;color:var(--accent-primary);">← 返回文章管理</a>\n    ' + commentsHtml + '\n  </div>\n  <script>' + APP_JS + '</script>\n</body>\n</html>';
}

// ----------
// ---------------------------------------------------------------------------
// 错误页面
// ---------------------------------------------------------------------------

export function renderErrorPage(locale, env, status, message) {
  const siteName = env.SITE_NAME || '我的博客';
  const prefix = locale === 'zh-TW' ? '/tw' : '/cn';
  const statusText = { 404: '404', 500: '500' }[status] || String(status);
  const emojis = { 404: '🔍', 500: '🔥' };
  const emoji = emojis[status] || '❓';
  const tip404 = locale === 'zh-TW' ? '找不到你要的頁面' : '找不到你要的页面';
  const tip500 = locale === 'zh-TW' ? '伺服器發生錯誤' : '服务器发生错误';
  const tipBack = locale === 'zh-TW' ? '返回首頁' : '返回首页';
  const tipDefault = locale === 'zh-TW' ? '出了點問題' : '出了点问题';
  const tips = { 404: tip404, 500: tip500 };
  const tip = tips[status] || tipDefault;

  return `<!DOCTYPE html>
<html lang="${locale}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#228be6">
  <meta name="color-scheme" content="light dark">
  <title>${statusText} - ${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  <main style="display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:20px;">
    <div>
      <div style="font-size:6rem;margin-bottom:8px;">${emoji}</div>
      <h1 style="font-size:3rem;font-weight:800;color:var(--text-primary);margin:0 0 8px 0;">${statusText}</h1>
      <p style="font-size:1.1rem;color:var(--text-tertiary);margin:0 0 24px 0;">${message || tip}</p>
      <a href="${prefix}/" style="display:inline-block;background:var(--accent-primary);color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;">${tipBack}</a>
    </div>
  </main>
  <script>${APP_JS}</script>
</body>
</html>`;
}
