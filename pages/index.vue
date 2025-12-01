<script setup lang="ts">
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
import ArticleCard from '~/components/ArticleCard.vue';
import { defineAsyncComponent } from 'vue';

const ClientOnlyList = defineAsyncComponent(() => import('../components/ClientOnlyList.vue'));

const config = useRuntimeConfig();
const page = useState('page', () => 1);

const { data: listData, pending, error } = await useFetch(
  `${config.public.apiBase}/articles`,
  {
    server: true,
    params: { page: page.value, pageSize: 10 },
  }
);
</script>

<template>
  <div>
    <Navbar />

    <main class="container">
      <h1>文章列表</h1>

      <div v-if="pending">加载中…</div>

      <div v-else-if="error">
        <p>服务端渲染失败（或网络异常），正在使用客户端降级渲染……</p>
        <ClientOnlyList />
      </div>

      <ul v-else>
        <li v-for="a in listData?.items || []" :key="a.id">
          <ArticleCard :article="a" />
        </li>
      </ul>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
</style>
