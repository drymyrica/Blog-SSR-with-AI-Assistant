import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:4000/api'
    }
  },
  nitro: {
    preset: 'node-server'
  },
  typescript: {
    shim: false
  },
  modules: [
    '@element-plus/nuxt'
  ],
  elementPlus: {
    icon: 'ElIcon'
  }
});
