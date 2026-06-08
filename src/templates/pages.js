/**
 * 页面渲染器 - Personal Website
 * 所有页面渲染函数，使用内联的 CSS/JS 模板
 * 内容统一使用 zh-CN，翻译由客户端 translate.js 处理
 */

import { CSS } from '../static/style-css.js';
import { APP_JS } from '../static/app-js.js';

// ---------------------------------------------------------------------------
// UI 文本
// ---------------------------------------------------------------------------

const T = {
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
  viewAll: '查看全部文章 →',
  about: '关于我',
  aboutContent: '你好！我是一名热爱技术的开发者。在这个博客里，我会分享关于编程、开源项目和技术思考的文章。欢迎与我交流！',
  comments: '评论',
  loginHint: '请先登录 GitHub 后评论',
  submitComment: '提交评论',
  noArticles: '暂无文章',
  noComments: '暂无评论，来发表第一条吧！',
  socialGithub: 'GitHub',
  socialTwitter: 'Twitter',
  socialEmail: 'Email',
  loginWithGithub: '使用 GitHub 登录',
  writeComment: '写下你的评论...',
  search: '搜索',
  searchPlace: '搜索文章...',
  searchResult: '的结果',
  pagePrev: '‹ 上一页',
  pageNext: '下一页 ›',
  notFound: '找不到你要的页面',
  serverError: '服务器发生错误',
  backHome: '返回首页',
  langSimplified: '简',
  langTraditional: '繁',
};

// ---------------------------------------------------------------------------
// Markdown to HTML
// ---------------------------------------------------------------------------

function markdownToHtml(text) {
  if (!text) return '';
  let html = escapeHtml(text);
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const langAttr = lang ? ' data-lang="' + lang + '"' : '';
    return '<pre' + langAttr + '><code>' + code.trim() + '</code></pre>';
  });
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^---$/gm, '<hr>');
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
// Pagination Helper
// ---------------------------------------------------------------------------

function renderPagination(page, totalPages, searchQuery = '') {
  if (totalPages <= 1) return '';
  let html = '<nav class="pagination" style="display:flex;justify-content:center;align-items:center;gap:6px;margin-top:32px;flex-wrap:wrap;">';
  const qs = searchQuery ? '&q=' + encodeURIComponent(searchQuery) : '';

  html += page > 1
    ? '<a href="/articles?page=' + (page - 1) + qs + '" style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;text-decoration:none;color:var(--text-primary);background:var(--bg-secondary);">' + T.pagePrev + '</a>'
    : '<span style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;color:var(--text-disabled);background:var(--bg-secondary);opacity:0.5;">' + T.pagePrev + '</span>';

  for (let i = 1; i <= totalPages; i++) {
    if (i === page) {
      html += '<span style="padding:8px 14px;border:1px solid var(--accent-primary);border-radius:6px;background:var(--accent-primary);color:#fff;font-weight:700;">' + i + '</span>';
    } else if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
      html += '<a href="/articles?page=' + i + qs + '" style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;text-decoration:none;color:var(--text-primary);background:var(--bg-secondary);">' + i + '</a>';
    } else if (Math.abs(i - page) === 3) {
      html += '<span style="padding:8px 6px;color:var(--text-tertiary);">...</span>';
    }
  }

  html += page < totalPages
    ? '<a href="/articles?page=' + (page + 1) + qs + '" style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;text-decoration:none;color:var(--text-primary);background:var(--bg-secondary);">' + T.pageNext + '</a>'
    : '<span style="padding:8px 14px;border:1px solid var(--border-color);border-radius:6px;color:var(--text-disabled);background:var(--bg-secondary);opacity:0.5;">' + T.pageNext + '</span>';

  html += '</nav>';
  return html;
}

// ---------------------------------------------------------------------------
// Fill Base Template
// ---------------------------------------------------------------------------

function fillBaseTemplate(params) {
  const siteName = params.siteName || T.siteName;
  const desc = escapeHtml(params.description || '');
  const canonicalUrl = params.canonicalUrl || '';
  const ogImage = params.ogImage || '';

  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${desc}">
  <meta name="keywords" content="${escapeHtml(params.keywords || '')}">
  <meta name="theme-color" content="#228be6">
  <meta name="color-scheme" content="light dark">
  <title>${escapeHtml(params.title || siteName)} - ${escapeHtml(siteName)}</title>
  <meta property="og:type" content="${params.ogType || 'website'}">
  <meta property="og:title" content="${escapeHtml(params.ogTitle || params.title || siteName)}">
  <meta property="og:description" content="${desc}">
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  ${canonicalUrl ? '<meta property="og:url" content="' + escapeHtml(canonicalUrl) + '">' : ''}
  ${ogImage ? '<meta property="og:image" content="' + escapeHtml(ogImage) + '">' : ''}
  <meta name="twitter:card" content="summary">
  ${canonicalUrl ? '<link rel="canonical" href="' + escapeHtml(canonicalUrl) + '">' : ''}
  <link rel="alternate" type="application/rss+xml" title="${escapeHtml(siteName)} RSS Feed" href="/rss.xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body class="${params.bodyClass || ''}">
  <!-- Navigation -->
  <nav class="navbar">
    <div class="navbar__inner">
      <a href="/" class="navbar__logo">${siteName}</a>
      <ul class="navbar__links">
        <li><a href="/" class="navbar__link ${params.currentPage === 'home' ? 'navbar__link--active' : ''}">${T.navHome}</a></li>
        <li><a href="/articles" class="navbar__link ${params.currentPage === 'articles' ? 'navbar__link--active' : ''}">${T.navArticles}</a></li>
        <li><a href="/about" class="navbar__link ${params.currentPage === 'about' ? 'navbar__link--active' : ''}">${T.navAbout}</a></li>
      </ul>
      <div class="navbar__actions">
        <div class="lang-switch">
          <button class="lang-switch__btn lang-switch__btn--active" id="langBtnCN" onclick="switchLang('chinese_simplified')">${T.langSimplified}</button>
          <button class="lang-switch__btn" id="langBtnTW" onclick="switchLang('chinese_traditional')">${T.langTraditional}</button>
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
    <a href="/" class="mobile-menu__link">${T.navHome}</a>
    <a href="/articles" class="mobile-menu__link">${T.navArticles}</a>
    <a href="/about" class="mobile-menu__link">${T.navAbout}</a>
  </div>
  <!-- Main Content -->
  <main class="main-content">${params.content || ''}</main>
  <!-- Footer -->
  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
  </footer>
  <!-- translate.js loaded dynamically by APP_JS -->
  <script>${APP_JS}</script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Page Renderers
// ---------------------------------------------------------------------------

export function renderHome(env, articles, page = 1, totalPages = 1) {
  const siteName = env.SITE_NAME || T.siteName;

  let articlesHtml = '';
  if (articles && articles.length > 0) {
    articlesHtml = articles.map(article => {
      const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '';
      const tagsHtml = (article.tags || []).map(tag => '<span class="tag">' + escapeHtml(tag) + '</span>').join('');
      return `
        <a href="/articles/${article.id}" class="article-card">
          <h3 class="article-card__title">${escapeHtml(article.title)}</h3>
          <div class="article-card__meta">${T.publishedOn} ${date}</div>
          <p class="article-card__excerpt">${escapeHtml(article.summary || (article.content || '').substring(0, 150) || '')}</p>
          <div class="article-card__tags">${tagsHtml}</div>
        </a>`;
    }).join('');
  } else {
    articlesHtml = '<p style="text-align:center;color:var(--text-tertiary);grid-column:1/-1;">' + T.noArticles + '</p>';
  }

  const content = `
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">${T.heroTitle}</h1>
        <p class="hero__subtitle">${T.heroSubtitle}</p>
        <a href="/articles" class="hero__cta">${T.heroCta}</a>
      </div>
    </section>
    <section class="container">
      <h2 style="font-size:1.3rem;font-weight:700;margin-top:20px;">${T.recentArticles}</h2>
      <div class="articles-grid">${articlesHtml}</div>
      ${renderPagination(page, totalPages)}
      <div style="text-align:center;margin-top:16px;">
        <a href="/articles" style="color:var(--accent-primary);font-weight:600;">${T.viewAll}</a>
      </div>
    </section>`;

  return fillBaseTemplate({
    title: T.siteName,
    siteName,
    description: T.heroSubtitle,
    content,
    currentPage: 'home',
  });
}

export function renderArticle(env, article, comments) {
  const siteName = env.SITE_NAME || T.siteName;
  const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '';
  const tagsHtml = (article.tags || []).map(tag => '<span class="tag">' + escapeHtml(tag) + '</span>').join(' ');

  let commentsHtml = '';
  if (comments && comments.length > 0) {
    const items = comments.map(c => {
      const cDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('zh-CN') : '';
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
    commentsHtml = '<ul class="comment-list">' + items + '</ul>';
  } else {
    commentsHtml = '<p class="no-comments">' + T.noComments + '</p>';
  }

  const content = `
    <article class="article-detail container container--narrow">
      <h1 class="article-detail__title">${escapeHtml(article.title)}</h1>
      <div class="article-detail__meta">
        <span>${T.publishedOn} ${date}</span>
        <span class="article-card__tags">${tagsHtml}</span>
      </div>
      <div class="article-detail__content">${markdownToHtml(article.content || '')}</div>
    </article>
    <section class="comments-section container container--narrow">
      <h2 class="comments-section__title">${T.comments} (${comments ? comments.length : 0})</h2>
      <div class="comment-form">
        <div class="comment-form__actions">
          <button id="githubLoginBtn" class="comment-form__login-btn">${T.loginWithGithub}</button>
          <span id="githubUserInfo" style="display:none;"></span>
        </div>
        <form id="commentForm" data-article-id="${article.id}">
          <textarea id="commentContent" class="comment-form__textarea" placeholder="${T.writeComment}" required></textarea>
          <div class="comment-form__actions" style="margin-top:12px;">
            <span style="font-size:0.85rem;color:var(--text-tertiary);">${T.loginHint}</span>
            <button type="submit" id="commentSubmit" class="comment-form__submit" disabled>${T.submitComment}</button>
          </div>
        </form>
      </div>
      ${commentsHtml}
    </section>`;

  return fillBaseTemplate({
    title: article.title,
    siteName,
    description: article.summary || '',
    content,
    currentPage: 'articles',
    ogType: 'article',
    canonicalUrl: '/articles/' + article.id,
  });
}

export function renderArticleList(env, articles, page = 1, totalPages = 1, searchQuery = '') {
  const siteName = env.SITE_NAME || T.siteName;

  let articlesHtml = '';
  if (articles && articles.length > 0) {
    articlesHtml = articles.map(article => {
      const date = article.createdAt ? new Date(article.createdAt).toLocaleDateString('zh-CN') : '';
      const tagsHtml = (article.tags || []).map(tag => '<span class="tag">' + escapeHtml(tag) + '</span>').join('');
      return `
        <a href="/articles/${article.id}" class="article-card">
          <h3 class="article-card__title">${escapeHtml(article.title)}</h3>
          <div class="article-card__meta">${T.publishedOn} ${date}</div>
          <p class="article-card__excerpt">${escapeHtml(article.summary || (article.content || '').substring(0, 150) || '')}</p>
          <div class="article-card__tags">${tagsHtml}</div>
        </a>`;
    }).join('');
  } else {
    articlesHtml = '<p style="text-align:center;color:var(--text-tertiary);grid-column:1/-1;">' + T.noArticles + '</p>';
  }

  const content = `
    <section class="container" style="padding-top:32px;">
      <h1 style="font-size:1.8rem;font-weight:700;margin-bottom:16px;">${T.navArticles}</h1>
      <form class="search-bar" action="/articles" method="GET" style="margin-bottom:24px;display:flex;gap:8px;max-width:500px;">
        <input type="text" name="q" value="${escapeHtml(searchQuery)}" placeholder="${T.searchPlace}"
               style="flex:1;padding:10px 16px;border:2px solid var(--border-color);border-radius:8px;font-size:1rem;background:var(--bg-secondary);color:var(--text-primary);outline:none;">
        <button type="submit" style="padding:10px 20px;background:var(--accent-primary);color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;">${T.search}</button>
      </form>
      ${searchQuery ? '<p style="margin-bottom:16px;color:var(--text-tertiary);">' + T.search + '「' + escapeHtml(searchQuery) + '」' + T.searchResult + '</p>' : ''}
      <div class="articles-grid">${articlesHtml}</div>
      ${renderPagination(page, totalPages, searchQuery)}
    </section>`;

  return fillBaseTemplate({
    title: T.navArticles,
    siteName,
    content,
    currentPage: 'articles',
  });
}

export function renderAbout(env) {
  const siteName = env.SITE_NAME || T.siteName;

  const content = `
    <section class="about-page">
      <div class="about-page__avatar">👤</div>
      <h1 class="about-page__title">${T.about}</h1>
      <p class="about-page__content">${T.aboutContent}</p>
      <div class="about-page__socials">
        <a href="https://github.com" class="about-page__social-link">${T.socialGithub}</a>
        <a href="https://twitter.com" class="about-page__social-link">${T.socialTwitter}</a>
        <a href="mailto:hello@example.com" class="about-page__social-link">${T.socialEmail}</a>
      </div>
    </section>`;

  return fillBaseTemplate({
    title: T.about,
    siteName,
    content,
    currentPage: 'about',
  });
}

// ---------------------------------------------------------------------------
// Admin Pages
// ---------------------------------------------------------------------------

export function renderAdminLogin(env) {
  const siteName = env.SITE_NAME || '我的博客';
  return '<!DOCTYPE html>\n<html lang="zh-CN" data-theme="light">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>登录 - ' + siteName + '</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n  <style>' + CSS + '</style>\n</head>\n<body>\n  <div class="login-page">\n    <div class="login-card">\n      <h1 class="login-card__title">🔐 管理后台</h1>\n      <p class="login-card__subtitle">请输入管理员凭据</p>\n      <div id="loginError" class="login-card__error"></div>\n      <form id="loginForm">\n        <div class="login-card__field">\n          <label class="login-card__label" for="loginUsername">用户名</label>\n          <input class="login-card__input" type="text" id="loginUsername" name="username" autocomplete="username" required>\n        </div>\n        <div class="login-card__field">\n          <label class="login-card__label" for="loginPassword">密码</label>\n          <input class="login-card__input" type="password" id="loginPassword" name="password" autocomplete="current-password" required>\n        </div>\n        <button type="submit" class="login-card__button">登录</button>\n      </form>\n    </div>\n  </div>\n  <script>' + APP_JS + '</script>\n</body>\n</html>';
}

export function renderAdminDashboard(env, articles, stats) {
  const siteName = env.SITE_NAME || '我的博客';

  const statsHtml = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card__value">${stats?.pageViews || 0}</div><div class="stat-card__label">浏览量</div></div>
      <div class="stat-card"><div class="stat-card__value">${stats?.visitors || 0}</div><div class="stat-card__label">访客数</div></div>
      <div class="stat-card"><div class="stat-card__value">${stats?.requests || 0}</div><div class="stat-card__label">请求数</div></div>
    </div>`;

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

  return '<!DOCTYPE html>\n<html lang="zh-CN" data-theme="light">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>管理后台 - ' + siteName + '</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n  <style>' + CSS + '</style>\n</head>\n<body>\n  <nav class="navbar"><div class="navbar__inner"><a href="/admin/" class="navbar__logo">' + siteName + ' - 管理后台</a><div class="navbar__actions"><button class="theme-toggle" onclick="toggleTheme()"><span class="icon-sun">☀️</span><span class="icon-moon">🌙</span></button><button class="btn btn--sm" onclick="logoutAdmin()">退出</button></div></div></nav>\n  <div class="admin-content">\n    <h1>📊 管理后台</h1>\n    ' + statsHtml + '\n    <div style="margin-top:24px;display:flex;justify-content:space-between;align-items:center;">\n      <a href="/admin/editor" class="btn btn--primary">➕ 新建文章</a>\n    </div>\n    <table class="admin-table" style="margin-top:16px;width:100%;border-collapse:collapse;">\n      <thead><tr><th>标题</th><th>日期</th><th>状态</th><th>操作</th></tr></thead>\n      <tbody>' + tableRows + '</tbody>\n    </table>\n  </div>\n  <script>' + APP_JS + '</script>\n</body>\n</html>';
}

export function renderAdminEditor(env, article) {
  const siteName = env.SITE_NAME || '我的博客';
  const isEdit = !!article;
  const articleId = article ? article.id : '';

  return '<!DOCTYPE html>\n<html lang="zh-CN" data-theme="light">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + (isEdit ? '编辑文章' : '新建文章') + ' - ' + siteName + '</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n  <style>' + CSS + '</style>\n</head>\n<body>\n  <nav class="navbar"><div class="navbar__inner"><a href="/admin/" class="navbar__logo">' + siteName + ' - 管理后台</a><div class="navbar__actions"><button class="theme-toggle" onclick="toggleTheme()"><span class="icon-sun">☀️</span><span class="icon-moon">🌙</span></button></div></div></nav>\n  <div class="admin-content editor">\n    <h1>' + (isEdit ? '编辑文章' : '新建文章') + '</h1>\n    <div class="editor__form">\n      <div class="editor__field"><label class="editor__label">标题</label><input type="text" id="editorTitle" class="editor__input" value="' + (isEdit ? escapeHtml(article.title || '') : '') + '" placeholder="文章标题"></div>\n      <div class="editor__field"><label class="editor__label">标签（逗号分隔）</label><input type="text" id="editorTags" class="editor__input" value="' + (isEdit ? escapeHtml((article.tags || []).join(', ')) : '') + '" placeholder="标签"></div>\n      <div class="editor__field"><label class="editor__label">&nbsp;</label><div class="editor__checkbox"><input type="checkbox" id="editorPublished" ' + (!isEdit || article.published ? 'checked' : '') + '><span>发布</span></div></div>\n      <div class="editor__tabs"><button class="editor__tab editor__tab--active" id="tabEdit">编辑</button><button class="editor__tab" id="tabPreview">预览</button></div>\n      <textarea class="editor__textarea" id="editorContent" placeholder="使用 Markdown 编写文章内容...">' + (isEdit ? escapeHtml(article.content || '') : '') + '</textarea>\n      <div class="editor__preview" id="editorPreview" style="display:none;"></div>\n      <div class="editor__actions"><button id="editorSave" class="btn btn--primary" data-article-id="' + articleId + '">' + (isEdit ? '更新文章' : '发布文章') + '</button></div>\n    </div>\n  </div>\n  <script>' + APP_JS + '</script>\n</body>\n</html>';
}

export function renderAdminComments(env, article, comments) {
  const siteName = env.SITE_NAME || '我的博客';

  let commentsHtml = '';
  if (!article) {
    commentsHtml = '<p style="text-align:center;color:var(--text-tertiary);padding:40px;">请从文章管理页面点击「评论」按钮进入</p>';
  } else if (!comments || comments.length === 0) {
    commentsHtml = '<p style="text-align:center;color:var(--text-tertiary);padding:40px;">该文章暂无评论</p>';
  } else {
    commentsHtml = comments.map(function(c) {
      const d = c.createdAt ? new Date(c.createdAt).toLocaleDateString('zh-CN') : '';
      const avatar = c.avatarUrl || 'https://github.githubassets.com/images/gravatars/gravatar-user-420.png';
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

  const title = article ? '评论管理：' + escapeHtml(article.title) : '评论管理';

  return '<!DOCTYPE html>\n<html lang="zh-CN" data-theme="light">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + title + ' - ' + siteName + '</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n  <style>' + CSS + '</style>\n</head>\n<body>\n  <nav class="navbar"><div class="navbar__inner"><a href="/admin/" class="navbar__logo">' + siteName + ' - 管理后台</a><div class="navbar__actions"><button class="theme-toggle" onclick="toggleTheme()"><span class="icon-sun">☀️</span><span class="icon-moon">🌙</span></button></div></div></nav>\n  <div style="max-width:800px;margin:80px auto 0;padding:20px;">\n    <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:20px;">' + title + '</h1>\n    <a href="/admin/" style="display:inline-block;margin-bottom:20px;color:var(--accent-primary);">← 返回文章管理</a>\n    ' + commentsHtml + '\n  </div>\n  <script>' + APP_JS + '</script>\n</body>\n</html>';
}

// ---------------------------------------------------------------------------
// 错误页面
// ---------------------------------------------------------------------------

export function renderErrorPage(locale, env, status, message) {
  const siteName = env.SITE_NAME || '我的博客';
  const statusText = String(status);
  const emojis = { 404: '🔍', 500: '🔥' };
  const emoji = emojis[status] || '❓';
  const tips = { 404: T.notFound, 500: T.serverError };
  const tip = tips[status] || '出了点问题';

  return '<!DOCTYPE html>\n<html lang="zh-CN" data-theme="light">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <meta name="theme-color" content="#228be6">\n  <title>' + statusText + ' - ' + siteName + '</title>\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n  <style>' + CSS + '</style>\n</head>\n<body>\n  <main style="display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:20px;">\n    <div>\n      <div style="font-size:6rem;margin-bottom:8px;">' + emoji + '</div>\n      <h1 style="font-size:3rem;font-weight:800;color:var(--text-primary);margin:0 0 8px 0;">' + statusText + '</h1>\n      <p style="font-size:1.1rem;color:var(--text-tertiary);margin:0 0 24px 0;">' + (message || tip) + '</p>\n      <a href="/" style="display:inline-block;background:var(--accent-primary);color:#fff;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;">' + T.backHome + '</a>\n    </div>\n  </main>\n  <script>' + APP_JS + '</script>\n</body>\n</html>';
}
