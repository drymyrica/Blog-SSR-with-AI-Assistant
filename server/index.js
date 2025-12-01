import express from 'express'
import { defineNitroPlugin } from '#imports'
import { fromNodeMiddleware } from 'h3'
import articlesRouter from './routes/articles.js'

export default defineNitroPlugin((nitroApp) => {
  const app = express()
  app.use(express.json())
  app.use('/api/articles', articlesRouter)
  nitroApp.h3App.use(fromNodeMiddleware(app))
})
