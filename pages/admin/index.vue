<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Article, ArticleList } from '~/types/article'

const filterStatus = ref('')
const filterKeyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const articles = ref([] as Article[])
const loading = ref(false)
const error = ref(false)

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await $fetch('/api/articles', {
      params: {
        status: filterStatus.value || '',
        q: filterKeyword.value || '',
        page: page.value,
        pageSize: pageSize.value
      }
    }) as ArticleList
    articles.value = res.items
    total.value = res.total
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// 页码切换
const onPageChange = (newPage: number) => {
  page.value = newPage
  fetchArticles()
}

// 删除文章
const deleteArticle = async (id: number) => {
  if (!confirm('确定要删除这篇文章吗？')) return
  try {
    await $fetch(`/api/articles/${id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    // 删除后刷新当前页
    fetchArticles()
  } catch (err) {
    console.error(err)
    ElMessage.error('删除失败')
  }
}

// 格式化状态
const formatStatus = (status: string) => {
  switch (status) {
    case 'published': return '已发布'
    case 'draft': return '草稿'
    case 'archived': return '已归档'
    default: return '未知'
  }
}

// 页面或筛选变化自动刷新
watch([filterStatus, filterKeyword], () => {
  page.value = 1
  fetchArticles()
})

// 初始加载
fetchArticles()
</script>

<template>
  <div class="admin-container">
    <Navbar />

    <main class="admin-main">
      <h1 class="admin-title">后台管理</h1>

      <div class="actions">
        <NuxtLink to="/admin/create" class="btn-create">新增文章</NuxtLink>
      </div>

      <!-- 状态过滤 + 搜索 -->
      <div class="filter">
        <label for="status">状态筛选：</label>
        <select id="status" v-model="filterStatus" @change="fetchArticles">
          <option value="">全部</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
          <option value="archived">已归档</option>
        </select>

        <input type="text" v-model="filterKeyword" placeholder="搜索标题或摘要" @keyup.enter="fetchArticles" />
        <button @click="fetchArticles" class="btn-search">搜索</button>
      </div>

      <div v-if="loading" class="loading">正在加载文章...</div>
      <div v-else-if="error" class="error">加载文章失败，请稍后重试。</div>
      <div v-else-if="!articles.length" class="empty">暂无文章</div>

      <ul v-else class="articles-list">
        <li v-for="article in articles" :key="article.id" class="article-item">
          <div class="article-info">
            <span class="title">{{ article.title }}</span>
            <span class="status" :class="article.status">{{ formatStatus(article.status) }}</span>
          </div>
          <div class="actions">
            <NuxtLink :to="`/admin/edit/${article.id}`" class="btn-edit">编辑</NuxtLink>
            <button class="btn-delete" @click="deleteArticle(article.id)">删除</button>
          </div>
        </li>
      </ul>

      <!-- 分页 -->
      <el-pagination v-if="total > pageSize" v-model:current-page="page" :page-size="pageSize" :total="total"
        layout="prev, pager, next" @current-change="onPageChange" class="pagination" />
    </main>
  </div>
</template>

<style
  scoped>
  .admin-container {
    min-height: 100vh;
    background-color: #f8f9fa;
    padding-bottom: 40px;
  }

  .admin-main {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .admin-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .actions {
    margin-bottom: 20px;
  }

  .btn-create,
  .btn-edit {
    display: inline-block;
    padding: 6px 12px;
    background-color: #667eea;
    color: white;
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.3s;
    font-size: 0.9rem;
  }

  .btn-create:hover,
  .btn-edit:hover {
    background-color: #5a67d8;
    transform: translateY(-2px);
  }

  .filter {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn-search {
    padding: 6px 12px;
    background-color: #48bb78;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-search:hover {
    background-color: #38a169;
  }

  .articles-list {
    list-style: none;
    padding: 0;
  }

  .article-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
    align-items: center;
  }

  .article-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .article-item .title {
    font-weight: 500;
    color: #333;
  }

  .status {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    color: white;
    text-transform: uppercase;
  }

  /* 状态颜色 */
  .status.published {
    background-color: #38a169;
  }

  .status.draft {
    background-color: #ed8936;
  }

  .status.archived {
    background-color: #718096;
  }

  .btn-delete {
    padding: 6px 12px;
    background-color: #e53e3e;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-left: 6px;
  }

  .btn-delete:hover {
    background-color: #c53030;
  }

  .loading,
  .error,
  .empty {
    text-align: center;
    padding: 40px 0;
    color: #666;
    font-size: 1rem;
  }
</style>
