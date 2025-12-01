import express from 'express';
import { config } from 'dotenv';
config();
import { OpenAI } from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

// POST /api/admin/ai/generate
router.post('/generate', async (req, res) => {
  const { title = '', keywords = '' } = req.body;
  if (!title && !keywords) return res.status(400).json({ error: 'title or keywords required' });

  const prompt = `为博客文章生成一个结构化草稿：
标题：${title}
关键词：${keywords}
输出：1) 文章摘要（50-80字） 2) 目录（3-5 小节） 3) 开头段落 4) 每个小节 2-3 个要点。`;
  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800
    });
    const text = resp.choices?.[0]?.message?.content || '';
    res.json({ suggestion: text });
  } catch (e) {
    console.error('AI generate error', e);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

export default router;
