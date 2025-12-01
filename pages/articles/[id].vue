

<template>
  <div>
    <Navbar />
    <main class="container">
      <div v-if="pending">加载中…</div>

      <div v-else-if="error">
        <p>服务端预取失败 — 显示占位并在客户端尝试加载完整内容。</p>
        <ClientOnlyArticle :slug="slug" />
      </div>

      <article v-else>
        <h1>{{ article.title }}</h1>
        <div v-html="article.content"></div>
      </article>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';
import ClientOnlyArticle from '~/components/ClientOnlyArticle.vue';
</script>

<style scoped>
.container { max-width: 900px; margin: 0 auto; padding: 20px; }
</style>
