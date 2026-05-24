# 个人网站 — Cloudflare Worker

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR_USERNAME/personal-website)

## ✨ 功能

- 🌐 **简繁中文** — `/cn/` 简体、`/tw/` 繁体，独立 URL
- 🌙 **日夜模式** — 自动检测 + 手动切换 + 记忆
- 📝 **管理后台** — 登录后添加/编辑/删除文章
- 📊 **访问统计** — Cloudflare Analytics 数据
- 💬 **GitHub 评论** — OAuth 授权后评论
- 📱 **响应式** — 移动端适配

---

## 🚀 部署（全程网页操作，不需要命令行）

### 第一步：把代码上传到 GitHub

1. 在 GitHub 上新建一个仓库（比如 `my-website`，**不要**勾选初始化 README）
2. 把本项目所有文件上传上去：
   - 最简单：GitHub 仓库页面 → **Add file** → **Upload files** → 把解压的文件夹拖进去
   - 或者用 GitHub Desktop 上传

### 第二步：在 Cloudflare 连接 GitHub 仓库

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧栏点击 **Workers 和 Pages**
3. 点击 **创建** → 选择 **Workers** 标签
4. 选择 **连接到 Git**
5. 授权 GitHub → 选择你刚创建的仓库
6. Cloudflare 会自动识别 `wrangler.toml`，直接点 **保存并部署**
7. 等待1-2分钟 → ✅ 网站上线！

> 部署成功后你的网站地址类似 `https://personal-website.你的账户ID.workers.dev`

### 第三步：创建 KV 存储（存文章和评论）

1. 在 Cloudflare Dashboard 左侧点击 **Workers 和 Pages** → **KV**
2. 点击 **创建命名空间**，依次创建 3 个：

| 命名空间名称 | 用途 |
|--------------|------|
| `ARTICLES_KV` | 存储文章 |
| `COMMENTS_KV` | 存储评论 |
| `SESSIONS_KV` | 存储登录会话 |

### 第四步：绑定 KV 到 Worker

1. 回到 **Workers 和 Pages** → 点击你的 Worker → **设置**
2. 找到 **变量和机密** → **KV 命名空间绑定**
3. 点击 **添加绑定**，依次添加：

| 变量名称 | 选择 KV 命名空间 |
|---------|-----------------|
| `ARTICLES_KV` | 刚才创建的 ARTICLES_KV |
| `COMMENTS_KV` | 刚才创建的 COMMENTS_KV |
| `SESSIONS_KV` | 刚才创建的 SESSIONS_KV |

4. 点击 **保存** → Worker 自动重新部署

### 第五步：设置环境变量（密码、GitHub OAuth）

1. 在 Worker **设置** → **变量和机密** → **添加**
2. 添加以下变量：

**必需：**

| 类型 | 变量名 | 值 |
|------|--------|-----|
| 文本 | `ADMIN_USERNAME` | 你的管理员用户名（如 `admin`） |
| 机密 | `ADMIN_PASSWORD` | 你的管理员密码 |
| 文本 | `GITHUB_CLIENT_ID` | GitHub OAuth Client ID |
| 机密 | `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret |

**可选（不设则统计显示0）：**

| 类型 | 变量名 | 值 |
|------|--------|-----|
| 文本 | `SITE_NAME` | 网站名称（默认"我的博客"） |
| 文本 | `CF_ACCOUNT_ID` | Cloudflare Account ID |
| 机密 | `CF_API_TOKEN` | Cloudflare API Token |

3. 点击 **保存** → 自动重新部署

### 第六步：创建 GitHub OAuth App（评论功能）

1. 打开 [GitHub → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. 点击 **New OAuth App**，填写：

| 字段 | 填写内容 |
|------|---------|
| Application name | 你的网站名 |
| Homepage URL | `https://你的workers.dev域名` |
| Authorization callback URL | `https://你的workers.dev域名/api/auth/github/callback` |

3. 创建后复制 **Client ID** 和 **Client Secret**
4. 回到第五步的环境变量中填入

---

## ✅ 完成！

| 页面 | 地址 |
|------|------|
| 简体中文首页 | `https://你的域名/cn/` |
| 繁体中文首页 | `https://你的域名/tw/` |
| 管理后台 | `https://你的域名/admin/` |

### 绑定自定义域名

在 Worker **设置** → **域和路由** → **添加** → **自定义域**，输入你的域名即可。

### 后续更新

每次在 GitHub 上修改代码，Cloudflare 自动重新部署。

---

## 📁 项目结构

```
personal-website/
├── src/
│   ├── worker.js              # Worker 主入口，路由分发
│   ├── routes/
│   │   └── api.js             # API 处理（文章/评论/OAuth）
│   ├── middleware/
│   │   └── auth.js            # 认证中间件
│   ├── templates/
│   │   └── pages.js           # 页面渲染
│   ├── utils/
│   │   ├── i18n.js            # 简繁中文翻译
│   │   └── analytics.js       # Cloudflare Analytics
│   └── static/
│       ├── style-css.js       # CSS
│       └── app-js.js          # 前端 JS
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions 自动部署
├── wrangler.toml              # Worker 配置
├── package.json
└── README.md
```

## 🔗 路由说明

| 路径 | 说明 |
|------|------|
| `/cn/` | 简体中文首页 |
| `/cn/articles` | 文章列表 |
| `/cn/articles/{id}` | 文章详情 |
| `/cn/about` | 关于 |
| `/tw/` | 繁体中文首页 |
| `/tw/articles` | 文章列表 |
| `/tw/articles/{id}` | 文章详情 |
| `/tw/about` | 關於 |
| `/admin/` | 管理后台 |
| `/admin/login` | 登录 |
| `/admin/editor` | 编辑文章 |

## 📡 API

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/admin/login` | 管理员登录 | 无 |
| POST | `/api/admin/articles` | 创建文章 | 管理员 |
| PUT | `/api/admin/articles/:id` | 更新文章 | 管理员 |
| DELETE | `/api/admin/articles/:id` | 删除文章 | 管理员 |
| GET | `/api/articles` | 文章列表 | 无 |
| GET | `/api/articles/:id` | 文章详情 | 无 |
| POST | `/api/comments/:articleId` | 提交评论 | GitHub OAuth |
| GET | `/api/comments/:articleId` | 评论列表 | 无 |
| GET | `/api/auth/github/callback` | GitHub OAuth 回调 | 无 |
| GET | `/api/stats` | 访问统计 | 无 |

## 🔧 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `ADMIN_USERNAME` | ✅ | 管理员用户名 |
| `ADMIN_PASSWORD` | ✅ | 管理员密码（设为机密） |
| `GITHUB_CLIENT_ID` | ✅ | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | ✅ | GitHub OAuth Client Secret（设为机密） |
| `SITE_NAME` | ❌ | 网站名称 |
| `CF_ACCOUNT_ID` | ❌ | Cloudflare Account ID（统计用） |
| `CF_API_TOKEN` | ❌ | Cloudflare API Token（统计用） |

## 🛠 技术栈

- **平台**: Cloudflare Worker
- **存储**: Cloudflare KV
- **CI/CD**: Cloudflare Dashboard 连接 GitHub 自动部署
- **认证**: GitHub OAuth 2.0
- **前端**: 原生 HTML/CSS/JS
- **字体**: Noto Sans SC / Noto Sans TC

## 📄 License
MIT
##本项目由ai生成
