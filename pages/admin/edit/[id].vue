<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { Article } from '~/types/article'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const formRef = ref()

const articleId = route.params.id as string

/* ------------------- 表单数据 ------------------- */
const form = ref({
  title: '',
  content: '',
  slug: '',
  status: 'draft'
})

/* ------------------- 校验规则 ------------------- */
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

/* ------------------- 自动生成 slug ------------------- */
function generateSlug() {
  form.value.slug = form.value.title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
}

/* ------------------- 拉取文章数据 ------------------- */
async function fetchArticle() {
  try {
    const res = await $fetch(`/api/articles/${articleId}`) as Article
    form.value.title = res.title
    form.value.content = res.content
    form.value.status = res.status
  } catch (e) {
    console.error(e)
    ElMessage.error('加载文章失败')
    router.push('/admin')
  }
}

/* ------------------- 提交修改 ------------------- */
async function submit() {
  await formRef.value.validate()

  loading.value = true
  try {
    await $fetch(`/api/articles/${articleId}`, {
      method: 'PUT',
      body: {
        title: form.value.title,
        content: form.value.content,
        summary: form.value.content.slice(0, 80),
        status: form.value.status
      }
    })
    ElMessage.success('文章已更新')
    router.push('/admin')
  } catch (e) {
    console.error(e)
    ElMessage.error('更新失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<template>
  <div class="admin-page">
    <Navbar />

    <el-card class="editor-card">
      <h1 class="title">✏️ 编辑文章</h1>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="90px"
        class="form"
      >
        <!-- 标题 -->
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入文章标题"
            @input="generateSlug"
          />
        </el-form-item>

        <!-- 内容 -->
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 20 }"
            v-model="form.content"
            placeholder="请输入文章内容（支持 Markdown）"
          />
        </el-form-item>

        <!-- 状态选择 -->
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="选择状态">
            <el-option label="已发布" value="published"></el-option>
            <el-option label="草稿" value="draft"></el-option>
            <el-option label="已归档" value="archived"></el-option>
          </el-select>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submit">
            保存修改
          </el-button>
          <el-button @click="router.push('/admin')">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.editor-card {
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 28px;
}

.form {
  margin-top: 10px;
}
</style>
