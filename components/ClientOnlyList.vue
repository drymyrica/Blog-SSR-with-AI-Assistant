<template>
  <div>
    <p v-if="loading">客户端渲染中，请稍候…</p>
    <ul v-else>
      <li v-for="article in articles" :key="article.id">
        {{ article.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const loading = ref(true)
const articles = ref<{ id: number; title: string }[]>([])

const config = useRuntimeConfig()
const pageSize = 10

onMounted(async () => {
    console.log('API 地址:', config.public.apiBase)

  try {
    const res = await fetch(`/api/articles?page=1&pageSize=${pageSize}`)
    if (!res.ok) throw new Error('网络错误')
    const data = await res.json()
    articles.value = data.items || []
  } catch (err) {
    console.error('客户端获取文章失败:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
p {
  color: #888;
}
ul {
  padding-left: 20px;
}
li {
  margin-bottom: 8px;
}
</style>
