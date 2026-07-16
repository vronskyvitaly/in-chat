import { baseApi } from '@/app/api/_base-api'

export type TComment = {
  id: number
  content: string
  postId: number
  authorId: number
  createdAt: string
  author: {
    id: number
    name: string
    avatar: string | null
  }
}

export const commentsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getComments: build.query<TComment[], number>({
      query: postId => ({ url: `api/posts/${postId}/comments` }),
      providesTags: (_result, _err, postId) => [{ type: 'Comments', id: postId }]
    }),
    addComment: build.mutation<TComment, { postId: number; content: string }>({
      query: ({ postId, content }) => ({
        url: `api/posts/${postId}/comments`,
        method: 'POST',
        body: { content }
      })
    })
  })
})

export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi
