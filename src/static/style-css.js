/**
 * CSS 样式 - 导出为字符串常量
 * 供 Cloudflare Worker 内联使用
 */

export const CSS = `
/* ============================================================
   Personal Website - Complete CSS Styles
   ============================================================ */

/* --- CSS Variables: Light Theme --- */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --bg-card: #ffffff;
  --bg-nav: rgba(255, 255, 255, 0.85);
  --bg-code: #f1f3f5;
  --bg-input: #ffffff;
  --bg-overlay: rgba(0, 0, 0, 0.5);

  --text-primary: #212529;
  --text-secondary: #495057;
  --text-tertiary: #868e96;
  --text-inverse: #ffffff;

  --link-color: #228be6;
  --link-hover: #1971c2;

  --border-color: #dee2e6;
  --border-light: #e9ecef;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-card-hover: 0 8px 30px rgba(0, 0, 0, 0.15);

  --accent-blue: #228be6;
  --accent-green: #40c057;
  --accent-red: #fa5252;
  --accent-orange: #fd7e14;
  --accent-yellow: #fab005;

  --tag-bg: #e7f5ff;
  --tag-text: #1971c2;

  --scrollbar-thumb: #ced4da;
  --scrollbar-track: #f1f3f5;
}

/* --- CSS Variables: Dark Theme --- */
[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-tertiary: #0f3460;
  --bg-card: #16213e;
  --bg-nav: rgba(26, 26, 46, 0.85);
  --bg-code: #0f3460;
  --bg-input: #16213e;
  --bg-overlay: rgba(0, 0, 0, 0.7);

  --text-primary: #e4e6eb;
  --text-secondary: #b0b3b8;
  --text-tertiary: #8a8d91;
  --text-inverse: #1a1a2e;

  --link-color: #4dabf7;
  --link-hover: #74c0fc;

  --border-color: #2d3748;
  --border-light: #2a3a52;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-card-hover: 0 8px 30px rgba(0, 0, 0, 0.6);

  --accent-blue: #4dabf7;
  --accent-green: #69db7c;
  --accent-red: #ff6b6b;
  --accent-orange: #ffa94d;
  --accent-yellow: #ffd43b;

  --tag-bg: rgba(77, 171, 247, 0.15);
  --tag-text: #74c0fc;

  --scrollbar-thumb: #2d3748;
  --scrollbar-track: #1a1a2e;
}

/* --- Reset & Base --- */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Noto Sans SC', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease, color 0.3s ease;
}

a {
  color: var(--link-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--link-hover);
}

img {
  max-width: 100%;
  height: auto;
}

::selection {
  background: var(--accent-blue);
  color: #fff;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* --- Layout --- */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.container--narrow {
  max-width: 780px;
}

.main-content {
  flex: 1;
  padding-top: 72px;
  padding-bottom: 60px;
}

/* --- Navigation --- */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--bg-nav);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.navbar__logo {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
  text-decoration: none;
}

.navbar__logo:hover {
  color: var(--accent-blue);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
}

.navbar__link {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: background-color 0.2s ease, color 0.2s ease;
  text-decoration: none;
}

.navbar__link:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.navbar__link--active {
  color: var(--accent-blue);
  background: var(--tag-bg);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* --- Language Switch --- */
.lang-switch {
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.lang-switch__btn {
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: transparent;
  color: var(--text-tertiary);
  transition: all 0.2s ease;
}

.lang-switch__btn--active {
  background: var(--accent-blue);
  color: #fff;
}

.lang-switch__btn:hover:not(.lang-switch__btn--active) {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

/* --- Theme Toggle --- */
.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--bg-tertiary);
  transform: rotate(15deg);
}

.icon-sun { display: inline; }
.icon-moon { display: none; }
[data-theme="dark"] .icon-sun { display: none; }
[data-theme="dark"] .icon-moon { display: inline; }

/* --- Hamburger --- */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
}

.hamburger__line {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger--active .hamburger__line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger--active .hamburger__line:nth-child(2) {
  opacity: 0;
}

.hamburger--active .hamburger__line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* --- Mobile Menu --- */
.mobile-menu {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 24px;
  transform: translateY(-100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 999;
}

.mobile-menu--open {
  transform: translateY(0);
  opacity: 1;
}

.mobile-menu__link {
  display: block;
  padding: 12px 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
  text-decoration: none;
  transition: color 0.2s ease;
}

.mobile-menu__link:hover {
  color: var(--accent-blue);
}

.mobile-menu__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

/* --- Hero Section --- */
.hero {
  text-align: center;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
}

.hero__title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.hero__subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: var(--accent-blue);
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.hero__cta:hover {
  background: var(--link-hover);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* --- Article Cards Grid --- */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 40px 0;
}

.article-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--accent-blue);
}

.article-card__title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.article-card__meta {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-bottom: 12px;
}

.article-card__excerpt {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

/* --- Tags --- */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 12px;
  background: var(--tag-bg);
  color: var(--tag-text);
}

/* --- Article Detail --- */
.article-detail {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 24px;
}

.article-detail__title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 16px;
}

.article-detail__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.article-detail__content {
  font-size: 1.05rem;
  line-height: 1.9;
}

.article-detail__content h1,
.article-detail__content h2,
.article-detail__content h3,
.article-detail__content h4 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
  color: var(--text-primary);
}

.article-detail__content h2 { font-size: 1.5rem; }
.article-detail__content h3 { font-size: 1.25rem; }

.article-detail__content p {
  margin-bottom: 1em;
}

.article-detail__content ul,
.article-detail__content ol {
  margin-bottom: 1em;
  padding-left: 2em;
}

.article-detail__content blockquote {
  margin: 1em 0;
  padding: 12px 20px;
  border-left: 4px solid var(--accent-blue);
  background: var(--bg-secondary);
  border-radius: 0 8px 8px 0;
  color: var(--text-secondary);
}

.article-detail__content code {
  background: var(--bg-code);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.article-detail__content pre {
  margin: 1em 0;
  padding: 16px;
  border-radius: 8px;
  background: var(--bg-code);
  overflow-x: auto;
}

.article-detail__content pre code {
  background: none;
  padding: 0;
}

.article-detail__content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.article-detail__content th,
.article-detail__content td {
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  text-align: left;
}

.article-detail__content th {
  background: var(--bg-secondary);
  font-weight: 600;
}

.article-detail__content img {
  border-radius: 8px;
  margin: 1em 0;
}

/* --- Comments Section --- */
.comments-section {
  max-width: 720px;
  margin: 40px auto 0;
  padding: 40px 24px;
  border-top: 1px solid var(--border-color);
}

.comments-section__title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 24px;
}

.comment-form {
  margin-bottom: 32px;
}

.comment-form__textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.comment-form__textarea:focus {
  outline: none;
  border-color: var(--accent-blue);
}

.comment-form__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.comment-form__login-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #24292e;
  color: #fff;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease;
  text-decoration: none;
}

.comment-form__login-btn:hover {
  background: #2f363d;
  color: #fff;
}

.comment-form__submit {
  padding: 8px 20px;
  background: var(--accent-blue);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.comment-form__submit:hover {
  background: var(--link-hover);
}

.comment-form__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-list {
  list-style: none;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
}

.comment-item__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-item__body {
  flex: 1;
}

.comment-item__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-item__author {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.comment-item__date {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.comment-item__content {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.no-comments {
  text-align: center;
  color: var(--text-tertiary);
  padding: 32px 0;
}

/* --- Login Page --- */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--shadow-md);
}

.login-card__title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.login-card__subtitle {
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 32px;
}

.login-card__field {
  margin-bottom: 20px;
}

.login-card__label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-secondary);
}

.login-card__input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.login-card__input:focus {
  outline: none;
  border-color: var(--accent-blue);
}

.login-card__button {
  width: 100%;
  padding: 12px;
  background: var(--accent-blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.login-card__button:hover {
  background: var(--link-hover);
}

.login-card__error {
  color: var(--accent-red);
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 16px;
  display: none;
}

.login-card__error--visible {
  display: block;
}

/* --- Admin Layout --- */
.admin-layout {
  display: flex;
  min-height: calc(100vh - 64px);
  padding-top: 64px;
}

.admin-sidebar {
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 24px 0;
  flex-shrink: 0;
}

.admin-sidebar__nav {
  list-style: none;
}

.admin-sidebar__item {
  display: block;
  padding: 10px 24px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.admin-sidebar__item:hover,
.admin-sidebar__item--active {
  color: var(--accent-blue);
  background: var(--tag-bg);
}

.admin-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.admin-content__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
}

/* --- Admin Stats Cards --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent-blue);
}

.stat-card__label {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: 4px;
}

/* --- Admin Articles Table --- */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.admin-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.admin-table td {
  padding: 12px 16px;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
}

.admin-table tr:hover td {
  background: var(--bg-secondary);
}

.admin-table__actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn--primary {
  background: var(--accent-blue);
  color: #fff;
  border-color: var(--accent-blue);
}

.btn--primary:hover {
  background: var(--link-hover);
  border-color: var(--link-hover);
  color: #fff;
}

.btn--danger {
  color: var(--accent-red);
  border-color: var(--accent-red);
}

.btn--danger:hover {
  background: var(--accent-red);
  color: #fff;
}

.btn--sm {
  padding: 4px 10px;
  font-size: 0.8rem;
}

/* --- Article Editor --- */
.editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.editor__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.editor__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.editor__input {
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 1rem;
}

.editor__input:focus {
  outline: none;
  border-color: var(--accent-blue);
}

.editor__tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--border-color);
}

.editor__tab {
  padding: 8px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
}

.editor__tab--active {
  color: var(--accent-blue);
  border-bottom-color: var(--accent-blue);
}

.editor__textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  resize: vertical;
}

.editor__textarea:focus {
  outline: none;
  border-color: var(--accent-blue);
}

.editor__preview {
  min-height: 400px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  line-height: 1.8;
}

.editor__preview h1,
.editor__preview h2,
.editor__preview h3 {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.editor__preview p {
  margin-bottom: 0.8em;
}

.editor__preview code {
  background: var(--bg-code);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.editor__preview pre {
  padding: 12px;
  background: var(--bg-code);
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

.editor__preview pre code {
  background: none;
  padding: 0;
}

.editor__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.editor__checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* --- About Page --- */
.about-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 60px 24px;
  text-align: center;
}

.about-page__avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 24px;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.about-page__title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.about-page__content {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.about-page__socials {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.about-page__social-link {
  padding: 8px 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.about-page__social-link:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}

/* --- Footer --- */
.footer {
  padding: 24px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  border-top: 1px solid var(--border-color);
}

/* --- Toast --- */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  z-index: 9999;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.toast--visible {
  opacity: 1;
  transform: translateY(0);
}

.toast--success { background: var(--accent-green); }
.toast--error { background: var(--accent-red); }
.toast--info { background: var(--accent-blue); }

/* --- Responsive --- */
@media (max-width: 1024px) {
  .admin-sidebar {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .navbar__links {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .hero__title {
    font-size: 1.8rem;
  }

  .hero__subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .admin-layout {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .admin-sidebar__nav {
    display: flex;
    overflow-x: auto;
    padding: 0 16px;
  }

  .admin-sidebar__item {
    white-space: nowrap;
    padding: 8px 16px;
  }

  .admin-content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .navbar__inner {
    padding: 0 16px;
  }

  .hero {
    padding: 60px 16px 40px;
  }

  .hero__title {
    font-size: 1.5rem;
  }

  .article-detail__title {
    font-size: 1.5rem;
  }

  .login-card {
    padding: 24px;
  }
}

/* --- Print --- */
@media print {
  .navbar, .footer, .mobile-menu,
  .comment-form, .theme-toggle, .lang-switch,
  .hamburger {
    display: none !important;
  }

  body {
    color: #000;
    background: #fff;
  }

  .main-content {
    padding-top: 0;
  }
}
}

/* ===== Code Syntax Highlighting ===== */
pre { position: relative; overflow-x: auto; }
pre[data-lang]::before {
  content: attr(data-lang);
  position: absolute; top: 0; right: 0;
  padding: 3px 12px; font-size: 0.7rem;
  color: var(--text-tertiary); background: var(--bg-tertiary);
  border-radius: 0 6px 0 8px; text-transform: uppercase;
  letter-spacing: 0.5px;
  border-left: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}
:not(pre) > code { background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }

`;