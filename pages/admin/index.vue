<template>
  <div class="admin">
    <Navbar />
    <h1>后台管理</h1>
    <router-link to="/admin/create">新增文章</router-link>
    <ul>
      <li v-for="article in articles" :key="article.id">
        {{ article.title }}
        <router-link :to="`/admin/edit/${article.id}`">编辑</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../../components/Navbar.vue'

const { data: articles } = await useAsyncData('admin-articles', async () => {
  return await $fetch('/api/articles')
})
</script>

<style scoped>
.admin {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 8px;
}
</style>
