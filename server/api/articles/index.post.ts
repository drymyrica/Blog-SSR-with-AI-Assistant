import db from '../../db/index.js'
import redis from '../../cache/redis.js'

const CACHE_PREFIX = 'articles:'
const LIST_TTL = 60 // 列表缓存 60 秒

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, content, summary, slug, status } = body

  if (!title || !content || !status) {
    throw createError({ statusCode: 400, statusMessage: '参数不完整' })
  }

  const allowedStatus = ['draft', 'published', 'archived']
  if (!allowedStatus.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: '状态不合法' })
  }

  const conn = await db.getConnection()
  try {
    const now = new Date()
    const [result] = await conn.query(
      `INSERT INTO articles (title, content, summary, slug, status, created_at, updated_at, views)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [title, content, summary || content.slice(0, 80), slug, status, now, now]
    )

    // 插入成功后，清理列表缓存
    try {
      const keys = await redis.keys(`${CACHE_PREFIX}list:*`)
      if (keys.length) await redis.del(...keys)
    } catch (e) {
      console.warn('Redis clear list cache failed:', e)
    }

    return {
      title,
      slug,
      summary,
      status,
      created_at: now,
      updated_at: now,
      views: 0
    }
  } finally {
    conn.release()
  }
})
