<template>
  <article class="card">
    <h2><NuxtLink :to="`/articles/${article.id}`">{{ article.title }}</NuxtLink></h2>
    <p class="summary">{{ article.summary }}</p>
    <div class="meta">发布于 {{ new Date(article.created_at).toLocaleString() }} · 浏览 {{ article.views }}</div>
  </article>
</template>

<script setup>
const props = defineProps({
  article: { type: Object, required: true }
});
console.log('ArticleCard received article:', props.article);
</script>

<style scoped>
.card { padding: 12px; border-bottom: 1px solid #eee; }
.summary { color: #666; }
.meta { color: #999; font-size: 12px; }
</style>
