const express = require('express');
const router = express.Router();

// 模拟文章数据
let articles = [
  {
    id: '1',
    title: 'Vue 3 新特性详解',
    excerpt: 'Vue 3 带来了许多激动人心的新特性，包括组合式 API、Teleport、Fragments 等...',
    content: `<h2>组合式 API</h2>
<p>Vue 3 引入了组合式 API，这是一个新的 API 设计，允许我们更灵活地组织组件逻辑。通过 setup 函数，我们可以更好地复用逻辑代码。</p>

<h2>Teleport</h2>
<p>Teleport 允许我们将组件渲染的内容转移到 DOM 树中的其他位置，这在处理模态框、通知等场景非常有用。</p>

<h2>Fragments</h2>
<p>Vue 3 支持多根节点组件，不再需要在模板中嵌套一个额外的根元素。</p>`,
    createdAt: '2024-01-15T10:30:00Z',
    author: 'Vue 爱好者',
    tags: ['Vue', '前端']
  },
  {
    id: '2',
    title: 'Nuxt.js SSR 性能优化指南',
    excerpt: '本文介绍如何优化 Nuxt.js 服务端渲染应用的性能，提升用户体验...',
    content: `<h2>服务端渲染优势</h2>
<p>服务端渲染可以提高首屏加载速度，有利于 SEO 优化。Nuxt.js 提供了开箱即用的 SSR 支持。</p>

<h2>性能优化技巧</h2>
<p>1. 使用 asyncData 或 fetch 钩子在服务端获取数据</p>
<p>2. 合理使用 keep-alive 缓存组件</p>
<p>3. 优化图片加载，使用懒加载</p>`,
    createdAt: '2024-01-10T14:20:00Z',
    author: 'Nuxt 开发者',
    tags: ['Nuxt', 'SSR', '性能优化']
  },
  {
    id: '3',
    title: 'Node.js 异步编程最佳实践',
    excerpt: '深入探讨 Node.js 中的异步编程模型和最佳实践...',
    content: `<h2>异步编程模型</h2>
<p>Node.js 采用事件驱动、非阻塞 I/O 的异步编程模型，这使得它能够高效处理并发请求。</p>

<h2>Promise 和 Async/Await</h2>
<p>现代 Node.js 开发中，推荐使用 Promise 和 async/await 来处理异步操作，使代码更加清晰易读。</p>`,
    createdAt: '2024-01-05T09:15:00Z',
    author: 'Node.js 专家',
    tags: ['Node.js', '异步编程']
  }
];

/**
 * @route GET /api/articles
 * @desc 获取文章列表
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // 过滤标签（如果提供）
    let filteredArticles = articles;
    if (tag) {
      filteredArticles = articles.filter(article => 
        article.tags && article.tags.includes(tag)
      );
    }
    
    // 分页
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    // 返回列表数据，不包含完整内容
    const articlesList = paginatedArticles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      createdAt: article.createdAt,
      author: article.author,
      tags: article.tags
    }));
    
    res.status(200).json({
      success: true,
      data: articlesList,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredArticles.length / limitNum),
        totalItems: filteredArticles.length,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

/**
 * @route GET /api/articles/:id
 * @desc 获取文章详情
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找文章
    const article = articles.find(article => article.id === id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: '文章不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('获取文章详情失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

/**
 * @route POST /api/articles
 * @desc 创建新文章
 * @access Private (需要管理员权限)
 */
router.post('/', async (req, res) => {
  try {
    const { title, content, excerpt, author, tags } = req.body;
    
    // 验证必填字段
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: '标题和内容是必填字段'
      });
    }
    
    // 创建新文章
    const newArticle = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      author: author || '管理员',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    articles.unshift(newArticle);
    
    res.status(201).json({
      success: true,
      data: newArticle,
      message: '文章创建成功'
    });
  } catch (error) {
    console.error('创建文章失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

/**
 * @route PUT /api/articles/:id
 * @desc 更新文章
 * @access Private (需要管理员权限)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, author, tags } = req.body;
    
    // 查找文章
    const articleIndex = articles.findIndex(article => article.id === id);
    
    if (articleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '文章不存在'
      });
    }
    
    // 更新文章
    articles[articleIndex] = {
      ...articles[articleIndex],
      title: title || articles[articleIndex].title,
      content: content || articles[articleIndex].content,
      excerpt: excerpt || articles[articleIndex].content.substring(0, 150) + '...',
      author: author || articles[articleIndex].author,
      tags: tags !== undefined ? tags : articles[articleIndex].tags,
      updatedAt: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: articles[articleIndex],
      message: '文章更新成功'
    });
  } catch (error) {
    console.error('更新文章失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

/**
 * @route DELETE /api/articles/:id
 * @desc 删除文章
 * @access Private (需要管理员权限)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找并删除文章
    const articleIndex = articles.findIndex(article => article.id === id);
    
    if (articleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '文章不存在'
      });
    }
    
    articles.splice(articleIndex, 1);
    
    res.status(200).json({
      success: true,
      message: '文章删除成功'
    });
  } catch (error) {
    console.error('删除文章失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    });
  }
});

module.exports = router;