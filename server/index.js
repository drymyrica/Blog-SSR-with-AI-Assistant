// server/index.js
import express from 'express';
import articlesRouter from './routes/articles.js'; // 你的 articles API
import cors from 'cors';

const app = express();
const port = 4000;

// 允许跨域请求，方便 Nuxt 前端 fetch
app.use(cors());
app.use(express.json());

// API 路由
app.use('/api/articles', articlesRouter);

// 测试根路由
app.get('/', (req, res) => {
  res.send('Server is running');
});

// 启动服务
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
