import db from '../../db/index.js'
import redis from '../../cache/redis.js'

const CACHE_PREFIX = 'articles:'
const DETAIL_TTL = 300

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) return createError({ statusCode: 400, statusMessage: 'Article id is required' })

  const cacheKey = `${CACHE_PREFIX}detail:id:${id}`

  // 尝试读取缓存
  try {
    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('Redis get error (detail)', e)
  }

  const conn = await db.getConnection()
  try {
    const [rows] = await conn.query(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    )
    if (!rows || (Array.isArray(rows) && rows.length === 0)) {
      return createError({ statusCode: 404, statusMessage: 'Not found' })
    }

    const article = Array.isArray(rows) ? rows[0] : rows

    // 写缓存
    try { await redis.set(cacheKey, JSON.stringify(article), 'EX', DETAIL_TTL) } catch (e) {
      console.warn('Redis set error (detail)', e)
    }

    return article
  } finally {
    conn.release()
  }
})
