<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import { ElEmpty } from 'element-plus'
import type { Article } from '~/types/article'
import ClientOnlyArticle from '~/components/ClientOnlyArticle.vue'

const route = useRoute()
const articleId = route.params.id as string

const { data: article, pending, error } = await useAsyncData<Article>(
  `article-${articleId}`,
  () => $fetch(`/api/articles/${articleId}`)
)
</script>

<template>
  <div class="detail-container">
    <Navbar />

    <main class="main-content">

      <!-- Loading 状态 -->
      <div v-if="pending" class="loading-state">
        <div class="loader"></div>
        <p>正在加载文章内容...</p>
      </div>

      <!-- SSR 失败 -->
      <div v-else-if="error" class="error-state">
        <ElEmpty description="服务端渲染失败，正在使用客户端降级渲染..." />
        <ClientOnlyArticle />
      </div>

      <!-- 空状态 -->
      <div v-else-if="!article" class="empty-state">
        <ElEmpty description="暂无文章" />
      </div>

      <!-- 文章详情 -->
      <article v-else class="article-detail">
        <h1 class="title">{{ article.title }}</h1>

        <div class="meta">
          <span>发布时间：{{ new Date(article.created_at).toLocaleString() }}</span>
          <span>· 浏览 {{ article.views }}</span>
        </div>

        <div class="content" v-html="article.content"></div>

        <NuxtLink to="/" class="back-link">← 返回首页</NuxtLink>
      </article>

    </main>

    <Footer />
  </div>
</template>

<style scoped>
.detail-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.main-content {
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.loading-state,
.empty-state,
.error-state {
  padding: 80px 20px;
  text-align: center;
  font-size: 1.1rem;
  color: #666;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid #e9ecef;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.article-detail {
  background-color: white;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.article-detail .title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

.article-detail .meta {
  font-size: 13px;
  color: #999;
  margin-bottom: 25px;
}

.article-detail .meta span {
  margin-right: 10px;
}

.article-detail .content {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #444;
}

.back-link {
  display: inline-block;
  margin-top: 30px;
  padding: 6px 12px;
  background-color: #667eea;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s;
}

.back-link:hover {
  background-color: #5a67d8;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 15px;
  }

  .article-detail {
    padding: 20px;
  }

  .article-detail .title {
    font-size: 1.6rem;
  }

  .article-detail .content {
    font-size: 1rem;
  }
}
</style>
