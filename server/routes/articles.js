import express from 'express';
import db from '../db/index.js';
import redis from '../cache/redis.js';

const router = express.Router();
const CACHE_PREFIX = 'articles:';
const LIST_TTL = 60; // 列表缓存 60s
const DETAIL_TTL = 300; // 详情缓存 5min

// 列表接口：GET /api/articles?page=1&pageSize=10&q=keyword
router.get('/', async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Number(req.query.pageSize || 10));
  const q = (req.query.q || '').trim();

  const cacheKey = `${CACHE_PREFIX}list:${q}:p${page}:s${pageSize}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  } catch (e) { console.warn('Redis get error (list)', e); }

  // 构建 SQL
  let where = `WHERE status = 'published'`;
  const params = [];
  if (q) {
    where += ` AND (title LIKE ? OR summary LIKE ?)`;
    params.push(`%${q}%`, `%${q}%`);
  }

  const offset = (page - 1) * pageSize;
  const conn = await db.getConnection();
  try {
    const [countRows] = await conn.query(`SELECT COUNT(*) as cnt FROM articles ${where}`, params);
    const total = countRows[0].cnt || 0;

    const [rows] = await conn.query(
      `SELECT id, title, slug, summary, created_at, updated_at, views FROM articles ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const result = { total, page, pageSize, items: rows };

    try { await redis.set(cacheKey, JSON.stringify(result), 'EX', LIST_TTL); } catch (e) { console.warn('Redis set error (list)', e); }

    res.json(result);
  } finally {
    conn.release();
  }
});

// 详情接口：GET /api/articles/:slug
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  const cacheKey = `${CACHE_PREFIX}detail:${slug}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      // 异步增加 views（不阻塞）
      db.query('UPDATE articles SET views = views + 1 WHERE slug = ?', [slug]).catch(()=>{});
      return res.json(JSON.parse(cached));
    }
  } catch (e) { console.warn('Redis get error (detail)', e); }

  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM articles WHERE slug = ? AND status = ?', [slug, 'published']);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const article = rows[0];

    try { await redis.set(cacheKey, JSON.stringify(article), 'EX', DETAIL_TTL); } catch (e) { console.warn('Redis set error (detail)', e); }
    db.query('UPDATE articles SET views = views + 1 WHERE slug = ?', [slug]).catch(()=>{});
    res.json(article);
  } finally {
    conn.release();
  }
});

// 其他管理接口（需鉴权）不在此公开
export default router;
