<template>
  <div class="admin">
    <Navbar />
    <h1>编辑文章</h1>
    <form @submit.prevent="submit">
      <div>
        <label>标题</label>
        <input v-model="title" />
      </div>
      <div>
        <label>内容</label>
        <textarea v-model="content"></textarea>
      </div>
      <button type="submit">更新</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../../../components/Navbar.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const title = ref('')
const content = ref('')

const { data: article } = await useAsyncData(`article-${id}`, async () => {
  return await $fetch(`/api/articles/${id}`)
})

title.value = article.value.title
content.value = article.value.content

async function submit() {
  await $fetch(`/api/articles/${id}`, {
    method: 'PUT',
    body: { title: title.value, content: content.value }
  })
  router.push('/admin')
}
</script>

<style scoped>
.admin {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
form div {
  margin-bottom: 12px;
}
</style>
