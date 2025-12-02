<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const formRef = ref()

/* ------------------- 表单数据 ------------------- */
const form = ref({
  title: '',
  content: '',
  prompt: '',
  slug: '' // 虽然不显示，但仍传到后端（数据库字段需要）
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
    .replace(/[^a-z0-9\-]/g, '') // 去除特殊字符
}

/* ------------------- 提交 ------------------- */
async function submit(status: 'draft' | 'published' | 'archived') {
  await formRef.value.validate()
  loading.value = true
  try {
    await $fetch('/api/articles', {
      method: 'POST',
      body: {
        title: form.value.title,
        content: form.value.content,
        summary: form.value.content.slice(0, 80),
        slug: form.value.slug,
        status
      }
    })

    ElMessage.success(
      status === 'draft'
        ? '草稿已保存'
        : status === 'published'
        ? '文章已发布'
        : '文章已归档'
    )
    router.push('/admin')
  } catch (e) {
    console.error(e)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

/* ------------------- AI 内容生成 ------------------- */
const aiLoading = ref(false)

async function generateAIContent() {
  if (!form.value.title.trim() && !form.value.prompt.trim()) {
    ElMessage.warning('请输入标题或关键词以生成内容')
    return
  }

  aiLoading.value = true
  try {
    const res = await $fetch('/api/ai/generate', {
      method: 'POST',
      body: { title: form.value.title, prompt: form.value.prompt }
    })
    // 假设返回 { content: string }
    if (res?.content) {
      form.value.content = res.content
      ElMessage.success('AI 内容生成完成')
    } else {
      ElMessage.error('AI 内容生成失败')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('AI 内容生成失败')
  } finally {
    aiLoading.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <Navbar />

    <el-card class="editor-card">
      <h1 class="title">✏️ 新增文章</h1>

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

        <!-- AI 内容生成按钮 -->
        <el-form-item label="🤖 AI 写作">
          <el-input
            v-model="form.prompt"
            placeholder="请输入提示词以生成内容"
            @input="generateSlug"
          />
          <el-button
            type="success"
            :loading="aiLoading"
            @click="generateAIContent"
          >
            生成
          </el-button>
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

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="submit('published')"
          >
            发布文章
          </el-button>

          <el-button
            type="info"
            :loading="loading"
            @click="submit('draft')"
          >
            保存草稿
          </el-button>

          <el-button
            type="warning"
            :loading="loading"
            @click="submit('archived')"
          >
            归档
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
