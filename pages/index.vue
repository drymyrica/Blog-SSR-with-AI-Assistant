<template>
  <div class="container">
    <Navbar />
    <h1>博客首页</h1>
    <div class="articles">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ArticleCard from '../components/ArticleCard.vue'
import Navbar from '../components/Navbar.vue'

// SSR 获取文章列表
const { data: articles } = await useAsyncData('articles', async () => {
  const res = await $fetch('/api/articles')
  return res
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.articles {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
