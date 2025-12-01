<template>
  <div class="admin">
    <Navbar />
    <h1>新增文章</h1>
    <form @submit.prevent="submit">
      <div>
        <label>标题</label>
        <input v-model="title" />
      </div>
      <div>
        <label>内容</label>
        <textarea v-model="content"></textarea>
      </div>
      <button type="submit">保存</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../../components/Navbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const title = ref('')
const content = ref('')

async function submit() {
  await $fetch('/api/articles', {
    method: 'POST',
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
