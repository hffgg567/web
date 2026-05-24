/**
 * 国际化 (i18n) 工具
 * 支持简体中文 (zh-CN) 和繁体中文 (zh-TW)
 */

/**
 * 翻译词条
 * 包含简体中文和繁体中文的常用翻译
 */
export const translations = {
  'zh-CN': {
    // 网站基础
    siteTitle: '个人网站',
    siteDescription: '分享技术与生活的个人博客',

    // 导航
    home: '首页',
    articles: '文章',
    about: '关于',
    admin: '管理',

    // 文章相关
    articleList: '文章列表',
    articleDetail: '文章详情',
    createArticle: '创建文章',
    editArticle: '编辑文章',
    deleteArticle: '删除文章',
    articleTitle: '文章标题',
    articleContent: '文章内容',
    articleSummary: '文章摘要',
    publishArticle: '发布文章',
    saveDraft: '保存草稿',
    noArticles: '暂无文章',

    // 评论相关
    comments: '评论',
    addComment: '添加评论',
    submitComment: '提交评论',
    commentContent: '评论内容',
    noComments: '暂无评论',
    loginToComment: '请登录后评论',

    // 认证相关
    login: '登录',
    logout: '退出登录',
    username: '用户名',
    password: '密码',
    loginWithGithub: '使用 GitHub 登录',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    logoutSuccess: '已退出登录',

    // 搜索
    search: '搜索',
    searchPlaceholder: '搜索文章...',
    searchResults: '搜索结果',
    noResults: '未找到相关内容',

    // 标签
    tags: '标签',
    allTags: '所有标签',
    tagFilter: '按标签筛选',

    // 通用
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    back: '返回',
    more: '更多',
    notFound: '页面未找到',
    serverError: '服务器错误',
    unauthorized: '未授权',
    forbidden: '禁止访问',
    createdAt: '创建于',
    updatedAt: '更新于',
    readMore: '阅读更多',
    pagination: {
      prev: '上一页',
      next: '下一页',
      page: '第 {page} 页',
      total: '共 {total} 篇',
    },

    // 统计
    stats: '统计',
    pageViews: '浏览量',
    visitors: '访客数',
    requests: '请求数',

    // 语言
    language: '语言',
    simplifiedChinese: '简体中文',
    traditionalChinese: '繁体中文',
  },

  'zh-TW': {
    // 網站基礎
    siteTitle: '個人網站',
    siteDescription: '分享技術與生活的個人部落格',

    // 導航
    home: '首頁',
    articles: '文章',
    about: '關於',
    admin: '管理',

    // 文章相關
    articleList: '文章列表',
    articleDetail: '文章詳情',
    createArticle: '建立文章',
    editArticle: '編輯文章',
    deleteArticle: '刪除文章',
    articleTitle: '文章標題',
    articleContent: '文章內容',
    articleSummary: '文章摘要',
    publishArticle: '發佈文章',
    saveDraft: '儲存草稿',
    noArticles: '暫無文章',

    // 評論相關
    comments: '評論',
    addComment: '新增評論',
    submitComment: '提交評論',
    commentContent: '評論內容',
    noComments: '暫無評論',
    loginToComment: '請登入後評論',

    // 認證相關
    login: '登入',
    logout: '登出',
    username: '使用者名稱',
    password: '密碼',
    loginWithGithub: '使用 GitHub 登入',
    loginSuccess: '登入成功',
    loginFailed: '登入失敗',
    logoutSuccess: '已登出',

    // 搜尋
    search: '搜尋',
    searchPlaceholder: '搜尋文章...',
    searchResults: '搜尋結果',
    noResults: '未找到相關內容',

    // 標籤
    tags: '標籤',
    allTags: '所有標籤',
    tagFilter: '依標籤篩選',

    // 通用
    loading: '載入中...',
    save: '儲存',
    cancel: '取消',
    confirm: '確認',
    delete: '刪除',
    edit: '編輯',
    back: '返回',
    more: '更多',
    notFound: '頁面未找到',
    serverError: '伺服器錯誤',
    unauthorized: '未授權',
    forbidden: '禁止存取',
    createdAt: '建立於',
    updatedAt: '更新於',
    readMore: '閱讀更多',
    pagination: {
      prev: '上一頁',
      next: '下一頁',
      page: '第 {page} 頁',
      total: '共 {total} 篇',
    },

    // 統計
    stats: '統計',
    pageViews: '瀏覽量',
    visitors: '訪客數',
    requests: '請求數',

    // 語言
    language: '語言',
    simplifiedChinese: '簡體中文',
    traditionalChinese: '繁體中文',
  },
};

/**
 * 从 URL 路径判断语言
 * @param {string} pathname - URL 路径
 * @returns {string} - 语言代码 ('zh-CN' 或 'zh-TW')
 */
export function getLocale(pathname) {
  if (pathname.startsWith('/cn/')) {
    return 'zh-CN';
  }
  if (pathname.startsWith('/tw/')) {
    return 'zh-TW';
  }
  // 默认简体中文
  return 'zh-CN';
}

/**
 * 获取翻译文本
 * 支持点号分隔的嵌套 key（如 'pagination.prev'）
 * @param {string} locale - 语言代码 ('zh-CN' 或 'zh-TW')
 * @param {string} key - 翻译 key
 * @param {Object} params - 可选的插值参数（如 { page: 1, total: 10 }）
 * @returns {string} - 翻译后的文本，如果未找到则返回 key
 */
export function t(locale, key, params = {}) {
  const localeTranslations = translations[locale] || translations['zh-CN'];

  // 支持嵌套 key，如 'pagination.prev'
  const keys = key.split('.');
  let value = localeTranslations;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 未找到翻译，返回 key
      return key;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // 处理插值参数，替换 {param} 格式
  let result = value;
  for (const [paramKey, paramValue] of Object.entries(params)) {
    result = result.replace(`{${paramKey}}`, paramValue);
  }

  return result;
}
