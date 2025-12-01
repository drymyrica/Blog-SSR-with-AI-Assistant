import db from '../../db/index.js'
import redis from '../../cache/redis.js'

const CACHE_PREFIX = 'articles:'
const LIST_TTL = 60 // 列表缓存 60s

export default defineEventHandler(async (event) => {
  const url = new URL(event.req.url!, `http://${event.req.headers.host}`)
  const q = (url.searchParams.get('q') || '').trim()
  const status = (url.searchParams.get('status') || '').trim() // 可选参数: archived | published | draft
  const page = Math.max(1, Number(url.searchParams.get('page') || 1))
  const pageSize = Math.min(100, Number(url.searchParams.get('pageSize') || 10))
  const offset = (page - 1) * pageSize

  const cacheKey = `${CACHE_PREFIX}list:${status || 'all'}:q=${q}:p${page}:s${pageSize}`
  try {
    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('Redis get error (list)', e)
  }

  // 构建 SQL
  let where = 'WHERE 1=1'
  const params: any[] = []

  // 根据 status 参数过滤
  const allowedStatus = ['archived', 'published', 'draft']
  if (status && allowedStatus.includes(status)) {
    where += ' AND status = ?'
    params.push(status)
  }

  // 搜索关键词
  if (q) {
    where += ' AND (title LIKE ? OR summary LIKE ?)'
    params.push(`%${q}%`, `%${q}%`)
  }

  const conn = await db.getConnection()
  try {
    // 查询总数
    const [countRows] = await conn.query(`SELECT COUNT(*) as cnt FROM articles ${where}`, params)
    const total = (countRows as any)[0]?.cnt || 0

    // 查询分页数据
    const [rows] = await conn.query(
      `SELECT id, title, slug, summary, created_at, updated_at, views, status
       FROM articles ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    )

    const result = { total, page, pageSize, items: rows }

    // 写入缓存
    try {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', LIST_TTL)
    } catch (e) {
      console.warn('Redis set error (list)', e)
    }

    return result
  } finally {
    conn.release()
  }
})
