<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import ArticleCard from '~/components/ArticleCard.vue'
import { defineAsyncComponent } from 'vue'
import { ElEmpty } from 'element-plus'
import type { ArticleList } from '~/types/article'


const ClientOnlyList = defineAsyncComponent(() => import('~/components/ClientOnlyList.vue'))

const page = useState('page', () => 1)
const pageSize = useState('pageSize', () => 9)

const { data: listData, pending, error, refresh } = await useAsyncData<ArticleList>(
  'articles',
  () =>
    $fetch('/api/articles', {
      params: { status:"published", page: page.value, pageSize: pageSize.value },
    }),
  { server: true }
)


const handlePageChange = (newPage: number) => {
  page.value = newPage
  refresh()
}
</script>

<template>
  <div class="blog-container">
    <Navbar />

    <!-- 顶部 Banner -->
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">我的技术博客</h1>
        <p class="hero-subtitle">记录 · 分享 · 成长</p>
      </div>
    </header>

    <main class="main-content">
      <div class="section-header">
        <h2 class="section-title">最新文章</h2>
        <div class="section-line"></div>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="loading-container">
        <div class="loader"></div>
        <p>正在加载文章...</p>
      </div>

      <!-- SSR 失败 -->
      <div v-else-if="error" class="error-container">
        <ElEmpty description="服务端渲染失败，正在使用客户端降级渲染..." />
        <ClientOnlyList />
      </div>

      <!-- 空状态 -->
      <div v-else-if="listData?.items?.length === 0" class="empty-container">
        <ElEmpty description="暂无文章" />
      </div>

      <!-- 正常文章列表 -->
      <div v-else class="articles-grid">
        <ArticleCard
          v-for="article in listData?.items || []"
          :key="article.id"
          :article="article"
          class="article-card"
        />
      </div>

      <!-- 分页 -->
      <div v-if="!error && listData && listData.total > 0" class="pagination-container">
        <el-pagination v-model:current-page="page" :page-size="pageSize" :total="listData.total"
        layout="prev, pager, next" @current-change="handlePageChange" class="pagination" />
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* 整体布局 */
.blog-container {
  background: #fafafa;
  min-height: 100vh;
}

/* 顶部 Banner */
.hero {
  background: linear-gradient(135deg, #4a6cff 0%, #7f9aff 100%);
  color: white;
  text-align: center;
  padding: 80px 20px 90px;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin-top: 10px;
}

/* 内容主体 */
.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* 区块标题 */
.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.section-line {
  width: 60px;
  height: 4px;
  background: #4a6cff;
  margin: 10px auto 0;
  border-radius: 2px;
}

/* Loading 样式 */
.loading-container {
  text-align: center;
  padding: 60px 0;
  font-size: 16px;
  color: #666;
}

.loader {
  width: 28px;
  height: 28px;
  border: 3px solid #c9d2ff;
  border-top-color: #4a6cff;
  border-radius: 50%;
  margin: 0 auto 10px;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 文章卡片网格 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
  padding-bottom: 40px;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 空状态 & 错误 */
.empty-container,
.error-container {
  padding: 60px 0;
}
</style>
