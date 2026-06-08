/**
 * 前端 JavaScript - 导出为字符串常量
 * 供 Cloudflare Worker 内联使用
 */

export const APP_JS = `
(function () {
  'use strict';

  /* ----------------------------------------------------------
     Theme Toggle
     ---------------------------------------------------------- */
  function getInitialTheme() {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  applyTheme(getInitialTheme());

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  };

  /* ----------------------------------------------------------
     Language Switch (translate.js)
     ---------------------------------------------------------- */
  function loadTranslateScript(cb) {
    var s = document.createElement('script');
    s.src = 'https://res.zvo.cn/translate/translate.js';
    s.onload = cb;
    s.onerror = function() { console.warn('translate.js load failed'); };
    document.head.appendChild(s);
  }

  function initTranslate() {
    if (typeof translate === 'undefined') {
      return loadTranslateScript(function() { initTranslate(); });
    }

    translate.selectLanguageTag.show = false;
    translate.language.setLocal('chinese_simplified');
    translate.service.use('client.edge');

    try {
      translate.ignore.tag.push('code');
      translate.ignore.tag.push('pre');
      translate.ignore.class.push('navbar__logo');
      translate.ignore.class.push('article-detail__title');
    } catch(e) {}

    translate.set.run.add(function() { updateLangBtnState(); });

    var savedLang = localStorage.getItem('displayLang');
    if (savedLang && savedLang !== 'chinese_simplified') {
      try { translate.changeLanguage(savedLang); } catch(e) {}
    }

    try { translate.listener.start(); } catch(e) {}
    try { translate.execute(); } catch(e) {}
  }

  function updateLangBtnState() {
    var currentLang = translate.language.getCurrent();
    var btnCN = document.getElementById('langBtnCN');
    var btnTW = document.getElementById('langBtnTW');
    if (btnCN) {
      btnCN.className = 'lang-switch__btn' + (currentLang === 'chinese_simplified' ? ' lang-switch__btn--active' : '');
    }
    if (btnTW) {
      btnTW.className = 'lang-switch__btn' + (currentLang === 'chinese_traditional' ? ' lang-switch__btn--active' : '');
    }
  }

  window.switchLang = function (lang) {
    localStorage.setItem('displayLang', lang);
    if (typeof translate !== 'undefined' && translate.changeLanguage) {
      translate.changeLanguage(lang);
      updateLangBtnState();
    }
  };

  // 启动翻译
  initTranslate();

  /* ----------------------------------------------------------
     Mobile Navigation Menu
     ---------------------------------------------------------- */
  window.toggleMobileMenu = function () {
    var menu = document.getElementById('mobileMenu');
    var hamburger = document.querySelector('.hamburger');
    if (!menu) return;

    var isOpen = menu.classList.contains('mobile-menu--open');
    if (isOpen) {
      menu.classList.remove('mobile-menu--open');
      if (hamburger) hamburger.classList.remove('hamburger--active');
    } else {
      menu.classList.add('mobile-menu--open');
      if (hamburger) hamburger.classList.add('hamburger--active');
    }
  };

  // Close mobile menu when clicking a link
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('mobile-menu__link')) {
      var menu = document.getElementById('mobileMenu');
      var hamburger = document.querySelector('.hamburger');
      if (menu) menu.classList.remove('mobile-menu--open');
      if (hamburger) hamburger.classList.remove('hamburger--active');
    }
  });

  // Escape key closes mobile menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var menu = document.getElementById('mobileMenu');
      var hamburger = document.querySelector('.hamburger');
      if (menu) menu.classList.remove('mobile-menu--open');
      if (hamburger) hamburger.classList.remove('hamburger--active');
    }
  });

  /* ----------------------------------------------------------
     Toast Notifications
     ---------------------------------------------------------- */
  window.showToast = function (message, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  };

  /* ----------------------------------------------------------
     Admin Login
     ---------------------------------------------------------- */
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var username = document.getElementById('loginUsername').value.trim();
      var password = document.getElementById('loginPassword').value;
      var errorEl = document.getElementById('loginError');

      if (!username || !password) {
        if (errorEl) {
          errorEl.textContent = '请输入用户名和密码';
          errorEl.classList.add('login-card__error--visible');
        }
        return;
      }

      fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, status: res.status, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.token) {
            document.cookie = 'admin_session=' + result.data.token + '; path=/; max-age=86400; SameSite=Strict';
            window.location.href = '/admin/';
          } else {
            if (errorEl) {
              errorEl.textContent = result.data.error || '登录失败，请检查用户名和密码';
              errorEl.classList.add('login-card__error--visible');
            }
          }
        })
        .catch(function () {
          if (errorEl) {
            errorEl.textContent = '网络错误，请稍后重试';
            errorEl.classList.add('login-card__error--visible');
          }
        });
    });
  }

  /* ----------------------------------------------------------
     Article Editor
     ---------------------------------------------------------- */
  var editorTextarea = document.getElementById('editorContent');
  var editorPreview = document.getElementById('editorPreview');
  var editorTabEdit = document.getElementById('tabEdit');
  var editorTabPreview = document.getElementById('tabPreview');

  if (editorTextarea) {
    // Simple markdown renderer
    function renderMarkdown(text) {
      if (!text) return '';
      var html = text;
      // Code blocks
      html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
      // Inline code
      html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
      // Headers
      html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
      // Bold & Italic
      html = html.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
      html = html.replace(/\\*(.+?)\\*/g, '<em>$1</em>');
      // Links
      html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>');
      // Images
      html = html.replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1">');
      // Blockquotes
      html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
      // Unordered lists
      html = html.replace(/^[\\-\\*] (.+)$/gm, '<li>$1</li>');
      // Horizontal rules
      html = html.replace(/^---$/gm, '<hr>');
      // Paragraphs
      html = html.replace(/^(?!<[hbluo]|<li|<pre|<hr)(.+)$/gm, '<p>$1</p>');
      return html;
    }

    // Live preview
    editorTextarea.addEventListener('input', function () {
      if (editorPreview) {
        editorPreview.innerHTML = renderMarkdown(editorTextarea.value);
      }
    });

    // Tab switching
    if (editorTabEdit && editorTabPreview) {
      editorTabEdit.addEventListener('click', function () {
        editorTabEdit.classList.add('editor__tab--active');
        editorTabPreview.classList.remove('editor__tab--active');
        editorTextarea.style.display = 'block';
        if (editorPreview) editorPreview.style.display = 'none';
      });

      editorTabPreview.addEventListener('click', function () {
        editorTabPreview.classList.add('editor__tab--active');
        editorTabEdit.classList.remove('editor__tab--active');
        editorTextarea.style.display = 'none';
        if (editorPreview) {
          editorPreview.innerHTML = renderMarkdown(editorTextarea.value);
          editorPreview.style.display = 'block';
        }
      });
    }

    // Save article
    var saveBtn = document.getElementById('editorSave');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var title = document.getElementById('editorTitle').value.trim();
        var content = editorTextarea.value;
        var tags = document.getElementById('editorTags').value.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
        var locale = document.getElementById('editorLocale').value;
        var published = document.getElementById('editorPublished').checked;
        var articleId = saveBtn.getAttribute('data-article-id');

        if (!title || !content) {
          showToast('请填写标题和内容', 'error');
          return;
        }

        var body = { title: title, content: content, tags: tags, locale: locale, published: published };
        var method = articleId ? 'PUT' : 'POST';
        var url = articleId ? '/api/admin/articles/' + articleId : '/api/admin/articles';

        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body)
        })
          .then(function (res) {
            return res.json().then(function (data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            if (result.ok) {
              showToast('保存成功', 'success');
              setTimeout(function () { window.location.href = '/admin/'; }, 1000);
            } else {
              showToast(result.data.error || '保存失败', 'error');
            }
          })
          .catch(function () {
            showToast('网络错误', 'error');
          });
      });
    }
  }

  /* ----------------------------------------------------------
     Admin: Delete Article
     ---------------------------------------------------------- */
  window.deleteArticle = function (id) {
    if (!confirm('确认删除此文章？')) return;
    fetch('/api/admin/articles/' + id, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          showToast('已删除', 'success');
          setTimeout(function () { window.location.reload(); }, 500);
        } else {
          showToast(result.data.error || '删除失败', 'error');
        }
      })
      .catch(function () {
        showToast('网络错误', 'error');
      });
  };

  /* ----------------------------------------------------------
     Admin: Toggle Publish
     ---------------------------------------------------------- */
  window.togglePublish = function (id, currentPublished) {
    var row = document.querySelector('[data-article-id="' + id + '"]');
    var title = row ? row.getAttribute('data-title') : '';
    // Fetch current article and toggle published
    fetch('/api/articles/' + id)
      .then(function (res) { return res.json(); })
      .then(function (article) {
        article.published = !currentPublished;
        return fetch('/api/admin/articles/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(article)
        });
      })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          showToast('状态已更新', 'success');
          setTimeout(function () { window.location.reload(); }, 500);
        } else {
          showToast(result.data.error || '更新失败', 'error');
        }
      })
      .catch(function () {
        showToast('网络错误', 'error');
      });
  };

  /* ----------------------------------------------------------
     删除评论 (事件委托)
     ---------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.comment-delete-btn');
    if (!btn) return;
    e.preventDefault();
    var commentId = btn.getAttribute('data-delete-comment');
    var articleId = btn.getAttribute('data-delete-article');
    if (!confirm('确认删除此评论？')) return;
    fetch('/api/admin/comments/' + articleId + '/' + commentId, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showToast('评论已删除', 'success');
          setTimeout(function () { window.location.reload(); }, 500);
        } else {
          showToast(data.error || '删除失败', 'error');
        }
      })
      .catch(function () {
        showToast('网络错误', 'error');
      });
  });

  /* ----------------------------------------------------------
     GitHub OAuth for Comments
     ---------------------------------------------------------- */
  var githubLoginBtn = document.getElementById('githubLoginBtn');
  if (githubLoginBtn) {
    githubLoginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      // Store current page URL for redirect back
      localStorage.setItem('comment_redirect', window.location.pathname);
      window.location.href = '/api/auth/github';
    });
  }

  // Handle OAuth callback result
  var githubToken = new URLSearchParams(window.location.search).get('github_token');
  if (githubToken) {
    localStorage.setItem('github_token', githubToken);
    // Clean up URL
    var cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    // Redirect to stored page or stay
    var redirect = localStorage.getItem('comment_redirect') || window.location.pathname;
    if (redirect !== window.location.pathname) {
      window.location.href = redirect;
    }
    showToast('GitHub 登录成功', 'success');
  }

  // Check if user is logged in with GitHub and update comment form
  function updateCommentForm() {
    var token = localStorage.getItem('github_token');
    var loginBtn = document.getElementById('githubLoginBtn');
    var submitBtn = document.getElementById('commentSubmit');
    var userInfo = document.getElementById('githubUserInfo');

    if (token && loginBtn) {
      loginBtn.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
      if (userInfo) {
        // Fetch user info
        fetch('/api/auth/github/user?token=' + token)
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.login) {
              userInfo.innerHTML = '<img src="' + data.avatar_url + '" class="comment-item__avatar" style="width:24px;height:24px;vertical-align:middle;margin-right:6px;">' + data.login;
              userInfo.style.display = 'inline';
            }
          })
          .catch(function () {});
      }
    }
  }
  updateCommentForm();

  // Submit comment
  var commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var token = localStorage.getItem('github_token');
      if (!token) {
        showToast('请先登录 GitHub', 'error');
        return;
      }
      var content = document.getElementById('commentContent').value.trim();
      var articleId = commentForm.getAttribute('data-article-id');
      if (!content) return;

      fetch('/api/comments/' + articleId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ content: content })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok) {
            showToast('评论已提交', 'success');
            document.getElementById('commentContent').value = '';
            setTimeout(function () { window.location.reload(); }, 500);
          } else {
            showToast(result.data.error || '评论失败', 'error');
          }
        })
        .catch(function () {
          showToast('网络错误', 'error');
        });
    });
  }
})();
`;
