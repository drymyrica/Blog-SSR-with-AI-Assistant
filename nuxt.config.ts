// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-12-01', // Nuxt 4 要求的兼容性日期
  ssr: true, // 开启服务端渲染

  // -------------------- 私密变量 / 公共变量 --------------------
  runtimeConfig: {
    // 私密变量：仅服务端可用
    mysqlHost:  'localhost',
    mysqlUser: 'root',
    mysqlPassword: '',
    mysqlDatabase: 'blog_db',

    redisHost: '127.0.0.1',
    redisPort: '6379',

    openaiApiKey: '',

    // 公共变量：前后端都可访问
    public: {
      apiBase: '/api'
    }
  },

  // -------------------- Nitro 配置 --------------------
  nitro: {
    preset: 'node',
    serveStatic: true,

    // 静态资源缓存（强缓存）
    publicAssets: [
      {
        baseURL: '/',
        dir: './public',   // 指定你的静态资源目录
        fallthrough: true,
        maxAge: 60 * 60 * 24 * 7, // 7天
      }
    ],

    // 开发环境代理 API - 指向我们的Express服务器
    devProxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },

  // -------------------- CORS --------------------
  routeRules: {
    '/**': {
      cors: true
    }
  },

  // -------------------- Vite 代理（开发环境可选） --------------------
  vite: {
    server: {
      proxy: {
        '/api': 'http://localhost:3001'
      }
    }
  },

  // -------------------- 静态资源目录 --------------------
  app: {
    buildAssetsDir: 'assets',
    head: {
      meta: []
    },
    // 确保根路由使用pages/index.vue
    rootId: 'app'
  },

  // -------------------- 构建优化 --------------------
  build: {
    transpile: []
  },

  modules: []
})
