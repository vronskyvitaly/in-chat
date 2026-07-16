export type TPost = {
  id: number
  title: string
  content: string
  imageUrl?: string | null
  authorId: string
  createdAt: string
  updatedAt: string
  likesCount?: number
  likedByMe?: boolean
  commentsCount?: number
  /** Присутствует в общей ленте (посты всех пользователей) */
  author?: {
    id: number
    name: string
    avatar: string | null
  }
}

export type TCreatePostRequest = {
  title: string
  content: string
}
