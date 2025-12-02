// server/api/admin/ai/generate.ts
import { defineEventHandler, readBody, createError } from 'h3'
import OpenAI from 'openai'

// 初始化 DeepSeek OpenAI SDK
const client = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
})

export default defineEventHandler(async (event) => {
  // 获取请求 body
  const body = await readBody(event)
  const title = (body.title || '').trim()
  const keywords = (body.prompt || '').trim()

  if (!title && !keywords) {
    throw createError({ statusCode: 400, statusMessage: 'title or keywords required' })
  }

  const prompt = `请为博客文章生成结构化内容建议：
标题：${title || '无标题'}
关键词：${keywords || '无关键词'}
要求：
1) 文章摘要（50-80字）
2) 目录（3-5 小节）
3) 开头段落
4) 每个小节提供 2-3 个要点
请用中文输出，格式清晰，方便直接写入文章内容。`

  try {
    const resp = await client.chat.completions.create({
      model: 'deepseek-chat',          // DeepSeek 模型
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.7
    })

    // 获取生成内容
    const content = resp.choices?.[0]?.message?.content?.trim() || ''
    return { content }

  } catch (err: any) {
    console.error('AI generation error:', err)
    if (err.response?.data) console.error('DeepSeek response:', err.response.data)
    throw createError({ statusCode: 500, statusMessage: 'AI generation failed' })
  }
})
