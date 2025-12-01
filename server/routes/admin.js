import express from 'express';
import db from '../db/index.js';
import redis from '../cache/redis.js';

const router = express.Router();
const CACHE_PREFIX = 'articles:';

// 新建文章 POST /api/admin/articles
router.post('/articles', async (req, res) => {
  const { title, slug, summary, content, author_id = 1, status = 'draft' } = req.body;
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query(
      'INSERT INTO articles (title, slug, summary, content, author_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, summary, content, author_id, status]
    );
    // 清理列表类缓存
    try {
      const keys = await redis.keys(`${CACHE_PREFIX}list*`);
      if (keys.length) await redis.del(...keys);
    } catch (e) { console.warn('Redis del error', e); }
    res.json({ id: result.insertId });
  } finally {
    conn.release();
  }
});

// 更新 PUT /api/admin/articles/:id
router.put('/articles/:id', async (req, res) => {
  const id = req.params.id;
  const fields = req.body;
  const conn = await db.getConnection();
  try {
    const sets = [];
    const params = [];
    for (const k of ['title','slug','summary','content','status']) {
      if (k in fields) { sets.push(`${k} = ?`); params.push(fields[k]); }
    }
    if (sets.length === 0) return res.status(400).json({ error: 'no fields' });
    params.push(id);
    await conn.query(`UPDATE articles SET ${sets.join(', ')} WHERE id = ?`, params);

    // 清缓存
    try {
      const keys = await redis.keys(`${CACHE_PREFIX}*`);
      if (keys.length) await redis.del(...keys);
    } catch (e) { console.warn('Redis del error', e); }
    res.json({ ok: true });
  } finally {
    conn.release();
  }
});

// 删除 DELETE /api/admin/articles/:id
router.delete('/articles/:id', async (req, res) => {
  const id = req.params.id;
  const conn = await db.getConnection();
  try {
    await conn.query('DELETE FROM articles WHERE id = ?', [id]);
    try {
      const keys = await redis.keys(`${CACHE_PREFIX}*`);
      if (keys.length) await redis.del(...keys);
    } catch (e) { console.warn('Redis del error', e); }
    res.json({ ok: true });
  } finally {
    conn.release();
  }
});

export default router;
