<template>
  <div class="container">
    <Navbar />
    <h1>{{ article.title }}</h1>
    <p>{{ article.content }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '../../components/Navbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id

const { data: article } = await useAsyncData(`article-${id}`, async () => {
  const res = await $fetch(`/api/articles/${id}`)
  return res
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
