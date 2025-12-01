<template>
  <header class="navbar">
    <nav class="nav-container">
      <!-- 左侧 Logo / 博客名 -->
      <NuxtLink to="/" class="logo">
        MyBlog
      </NuxtLink>

      <!-- 中间导航菜单 -->
      <div class="nav-links">
        <NuxtLink to="/" class="nav-item">首页</NuxtLink>
        <NuxtLink to="/admin" class="nav-item">后台管理</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
const isDark = computed(() => mode.value === 'dark')

</script>

<style scoped>
/* 整体导航条 */
.navbar {
  background: var(--navbar-bg);
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 容器（左右布局） */
.nav-container {
  max-width: 1060px;
  margin: 0 auto;
  padding: 0 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-color);
  text-decoration: none;
  transition: 0.2s;
}

.logo:hover {
  color: var(--primary-color);
}

/* 导航菜单 */
.nav-links {
  display: flex;
  gap: 20px;
}

/* 导航项 */
.nav-item {
  font-size: 15px;
  color: var(--text-color);
  text-decoration: none;
  padding: 4px 2px;
  border-bottom: 2px solid transparent;
  transition: 0.2s;
}

.nav-item:hover {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

/* 后台按钮（特别强调） */
.admin-btn {
  font-weight: 600;
  color: var(--admin-color);
}

.admin-btn:hover {
  color: var(--admin-color-hover);
  border-bottom-color: var(--admin-color-hover);
}

/* 深色模式切换按钮 */
.theme-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

/* 主题变量 */
:root {
  --navbar-bg: rgba(255, 255, 255, 0.8);
  --border-color: #ddd;
  --text-color: #333;
  --primary-color: #0077ff;
  --admin-color: #d14;
  --admin-color-hover: #e33;
}

/* 深色模式 */
.dark {
  --navbar-bg: rgba(20, 20, 20, 0.7);
  --border-color: #444;
  --text-color: #eee;
  --primary-color: #4fa8ff;

  --admin-color: #ff6b6b;
  --admin-color-hover: #ff8a8a;
}
</style>
