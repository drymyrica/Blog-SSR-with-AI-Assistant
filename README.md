# Blog-SSR-with-AI-Assistant

一个基于Nuxt.js和Express的服务端渲染博客系统，集成AI写作助手功能。

## 项目简介

本项目是一个现代化的博客系统，采用前后端分离架构：
- 前端使用Nuxt.js 3进行服务端渲染，提供优秀的SEO和用户体验
- 后端使用Express.js提供RESTful API
- 集成AI写作助手，支持自动生成文章大纲、内容和优化现有文章
- 支持Docker容器化部署，方便在各种环境中运行

## 功能特性

### 前端功能
- 服务端渲染的文章列表页
- 服务端渲染的文章详情页
- 响应式设计，适配各种设备
- 优雅的页面过渡动画

### 后端功能
- RESTful API设计
- 文章的增删改查操作
- AI写作助手功能
  - 自动生成文章大纲
  - 智能撰写文章内容
  - 文章内容优化（SEO、可读性等）
- 性能优化：Redis缓存
- 安全措施：CORS、Helmet、速率限制

### 部署功能
- Docker容器化支持
- Docker Compose一键部署
- 支持Redis缓存服务
- 可选的数据库支持（MongoDB/MySQL）

## 技术栈

### 前端
- **Nuxt.js 3** - Vue.js的服务端渲染框架
- **Vue.js 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **CSS** - 样式处理

### 后端
- **Node.js** - JavaScript运行时
- **Express.js** - Web应用框架
- **Redis** - 高性能缓存
- **MongoDB/MySQL** - 数据库（可选）

### 部署
- **Docker** - 容器化平台
- **Docker Compose** - 多容器应用编排

## 目录结构

```
Blog-SSR-with-AI-Assistant/
├── nuxt/                     # Nuxt.js前端项目
│   ├── pages/                # 页面目录
│   │   ├── index.vue         # 文章列表页 (SSR)
│   │   └── articles/
│   │       └── [id].vue      # 文章详情页 (SSR)
│   ├── composables/          # 组合式函数
│   ├── app.vue               # 根组件
│   ├── nuxt.config.ts        # Nuxt配置
│   └── Dockerfile            # 前端Docker配置
├── server/                   # Express后端
│   ├── app.js                # 后端入口文件
│   ├── routes/               # 路由目录
│   │   ├── articles.js       # 文章相关路由
│   │   └── admin.js          # 管理和AI助手路由
│   ├── db/                   # 数据库配置
│   │   └── index.js
│   ├── cache/                # 缓存配置
│   │   └── redis.js
│   └── Dockerfile            # 后端Docker配置
├── docker/                   # Docker配置
│   └── docker-compose.yml    # Docker Compose配置
└── README.md                 # 项目说明文档
```

## 快速开始

### 环境要求
- Node.js >= 18.x
- npm 或 yarn
- Docker 和 Docker Compose（可选，用于容器化部署）

### 本地开发

#### 1. 安装前端依赖

```bash
cd nuxt
npm install
```

#### 2. 安装后端依赖

```bash
cd ../server
npm install
```

#### 3. 启动前端开发服务器

```bash
cd nuxt
npm run dev
```

前端服务将运行在 http://localhost:3000

#### 4. 启动后端服务器

```bash
cd server
npm run dev
```

后端服务将运行在 http://localhost:3001

### 使用Docker Compose部署

#### 1. 构建并启动所有服务

```bash
cd docker
docker-compose up -d --build
```

#### 2. 查看服务状态

```bash
docker-compose ps
```

#### 3. 停止服务

```bash
docker-compose down
```

## API文档

### 前端API

- **GET /** - 文章列表页
- **GET /articles/:id** - 文章详情页

### 后端API

#### 文章相关
- **GET /api/articles** - 获取文章列表
- **GET /api/articles/:id** - 获取文章详情
- **POST /api/articles** - 创建新文章（需要管理员权限）
- **PUT /api/articles/:id** - 更新文章（需要管理员权限）
- **DELETE /api/articles/:id** - 删除文章（需要管理员权限）

#### AI写作助手
- **POST /api/admin/ai/generate-outline** - 生成文章大纲
- **POST /api/admin/ai/generate-content** - 生成文章内容
- **POST /api/admin/ai/optimize-content** - 优化文章内容

#### 管理功能
- **GET /api/admin/stats** - 获取统计信息
- **POST /api/admin/auth/login** - 管理员登录

## 环境变量配置

### 前端环境变量

```
NODE_ENV=production
API_BASE_URL=http://backend:3001/api
```

### 后端环境变量

```
NODE_ENV=production
PORT=3001
REDIS_HOST=redis
REDIS_PORT=6379

# MongoDB配置（可选）
# MONGODB_URI=mongodb://mongo:27017/blog

# MySQL配置（可选）
# DB_HOST=mysql
# DB_USER=admin
# DB_PASSWORD=password
# DB_NAME=blog
```

## 性能优化

1. **服务端渲染** - 使用Nuxt.js实现SEO友好的服务端渲染
2. **Redis缓存** - 缓存热点数据，减少数据库查询
3. **代码分割** - 前端实现代码分割，减小初始加载体积
4. **Docker优化** - 使用多阶段构建减小镜像体积

## 安全性

1. **CORS配置** - 严格控制允许的来源
2. **Helmet** - 增强Express应用的安全性
3. **速率限制** - 防止暴力攻击
4. **环境变量** - 敏感信息通过环境变量配置

## 未来规划

1. 集成真实的AI API（如OpenAI、百度文心一言等）
2. 添加用户认证系统
3. 实现评论功能
4. 添加搜索功能
5. 支持Markdown编辑器
6. 添加主题切换功能

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交Issue。