export type TPost = {
  id: number
  title: string
  content: string
  imageUrl?: string | null
  authorId: string
  createdAt: string
  updatedAt: string
}

export type TCreatePostRequest = {
  title: string
  content: string
}
