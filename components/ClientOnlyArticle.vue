<template>
  <div>
    <p v-if="loading">加载文章中…</p>
    <div v-else-if="article">
      <h1>{{ article.title }}</h1>
      <p>{{ article.content }}</p>
    </div>
    <p v-else>文章未找到</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'

const route = useRoute()
const config = useRuntimeConfig()
const loading = ref(true)
const article = ref<{ title: string; content: string } | null>(null)

onMounted(async () => {
  try {
    const res = await fetch(`${config.public.apiBase}/articles/${route.params.id}`)
    if (!res.ok) throw new Error('网络错误')
    article.value = await res.json()
  } catch (err) {
    console.error('获取文章失败', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
h1 {
  margin-bottom: 16px;
}
p {
  line-height: 1.6;
}
</style>
