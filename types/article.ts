export interface Article {
  id: number
  title: string
  summary: string
  content: string
  created_at: string
  views: number
  status: 'archived' | 'published' | 'draft'
}

export interface ArticleList {
  items: Article[]
  total: number
}
