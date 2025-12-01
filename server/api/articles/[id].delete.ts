import db from '../../db/index.js'
import redis from '../../cache/redis.js'

const CACHE_PREFIX = 'articles:'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    return createError({ statusCode: 400, statusMessage: '缺少文章 ID' })
  }

  const conn = await db.getConnection()
  try {
    // 删除文章
    const [result] = await conn.query('DELETE FROM articles WHERE id = ?', [id])
    const affectedRows = (result as any).affectedRows || 0
    if (affectedRows === 0) {
      return createError({ statusCode: 404, statusMessage: '文章不存在' })
    }

    // 删除相关缓存（简单策略：清理所有文章列表缓存）
    try {
      const keys = await redis.keys(`${CACHE_PREFIX}list*`)
      if (keys.length > 0) {
        await redis.del(keys)
      }
    } catch (e) {
      console.warn('Redis clear cache error', e)
    }

    return { success: true, message: '删除成功' }
  } finally {
    conn.release()
  }
})
