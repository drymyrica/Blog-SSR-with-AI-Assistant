<template>
  <div class="article-card">
    <h2>{{ article.title }}</h2>
    <p>{{ article.content.slice(0, 100) }}...</p>
    <NuxtLink :to="`/article/${article.id}`">阅读更多</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  article: { id: number; title: string; content: string }
}>()
</script>

<style scoped>
.article-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 4px;
}
</style>
