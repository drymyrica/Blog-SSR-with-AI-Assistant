import db from '../../db/index.js'
import redis from '../../cache/redis.js'

const CACHE_PREFIX = 'articles:'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    if (!id) return createError({ statusCode: 400, statusMessage: '缺少文章 ID' })

    const body = await readBody(event)
    const { title, content, summary, slug, status } = body

    if (!title || !content || !status) {
        return createError({ statusCode: 400, statusMessage: '参数不完整' })
    }

    const allowedStatus = ['archived', 'published', 'draft']
    if (!allowedStatus.includes(status)) {
        return createError({ statusCode: 400, statusMessage: '状态值不合法' })
    }

    const conn = await db.getConnection()
    try {
        const [result] = await conn.query(
            'UPDATE articles SET title = ?, content = ?, summary = ?, status = ?, updated_at = NOW() WHERE id = ?',
            [title, content, summary, status, id]
        )

        const affectedRows = (result as any).affectedRows || 0
        if (affectedRows === 0) {
            return createError({ statusCode: 404, statusMessage: '文章不存在' })
        }

        // 删除相关文章列表缓存
        const listKeys = await redis.keys(`${CACHE_PREFIX}list*`)
        if (listKeys.length > 0) await redis.del(listKeys)

        // 删除当前文章详情缓存
        try {
            const detailKey = `${CACHE_PREFIX}detail:id:${id}`
            await redis.del(detailKey)
        } catch (e) {
            console.warn('Redis delete detail cache error', e)
        }


        return { success: true, message: '文章已更新' }
    } finally {
        conn.release()
    }
})
