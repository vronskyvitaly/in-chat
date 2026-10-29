import { baseApi } from '@/app/api/_base-api'
import { subscribeToEvent } from '@/common/lib'
import { SOCKET_EVENT_POSTS } from '@/features/posts/constants'
import type { TPost } from '@/features/posts/types'
import { getCookieUtil } from '@/common/utils'
import type { TComment } from '@/features/comments/api'
import { commentsApi } from '@/features/comments/api'

/** Общие подписки на лайки и комментарии для любого кеша постов */
const subscribePostEvents = (
  updateCachedData: (cb: (draft: TPost[]) => void) => void,
  dispatch: any,
  query: { userId: number; name: string }
) => {
  const unsubLiked = subscribeToEvent<
    { postId: number; liked: boolean; likesCount: number; userId: number },
    typeof query
  >(
    SOCKET_EVENT_POSTS.POST_LIKED,
    data => {
      updateCachedData(draft => {
        const post = draft.find(p => p.id === data.postId)
        if (post) {
          post.likesCount = data.likesCount
          // Обновляем likedByMe только для текущего пользователя
          if (data.userId === query.userId) {
            post.likedByMe = data.liked
          }
        }
      })
    },
    query
  )

  const unsubComment = subscribeToEvent<{ postId: number; comment: TComment }, typeof query>(
    SOCKET_EVENT_POSTS.COMMENT_CREATED,
    data => {
      updateCachedData(draft => {
        const post = draft.find(p => p.id === data.postId)
        if (post) {
          post.commentsCount = (post.commentsCount ?? 0) + 1
        }
      })
      // Обновляем кеш комментариев, если он уже загружен
      dispatch(
        commentsApi.util.updateQueryData('getComments', data.postId, (draft: TComment[]) => {
          if (!draft.find(c => c.id === data.comment.id)) {
            draft.push(data.comment)
          }
        })
      )
    },
    query
  )

  const unsubUpdated = subscribeToEvent<
    { postId: number; content: string; updatedAt: string },
    typeof query
  >(
    SOCKET_EVENT_POSTS.POST_UPDATED,
    data => {
      updateCachedData(draft => {
        const post = draft.find(p => p.id === data.postId)
        if (post) {
          post.content = data.content
          post.updatedAt = data.updatedAt
        }
      })
    },
    query
  )

  return [unsubLiked, unsubComment, unsubUpdated]
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchPosts: build.query<TPost[], void>({
      query: () => ({ url: 'api/posts/get-user-posts' }),
      providesTags: ['PostsUser'],
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        await cacheDataLoaded

        const userId = await getCookieUtil('userId')
        const query = { userId: +userId!, name: 'test' }

        const unsubDeleted = subscribeToEvent<{ postId: number }, typeof query>(
          SOCKET_EVENT_POSTS.POST_DELETED,
          data => {
            updateCachedData(draft => {
              const postIndex = draft.findIndex(post => post.id === data.postId)
              if (postIndex !== -1) {
                draft.splice(postIndex, 1)
              }
            })
          },
          query
        )

        const unsubCreated = subscribeToEvent<
          { message: string; post: TPost; timestamp: Date },
          typeof query
        >(
          SOCKET_EVENT_POSTS.POST_CREATED,
          data => {
            updateCachedData(draft => {
              draft.unshift(data.post)
            })
          },
          query
        )

        const eventUnsubs = subscribePostEvents(updateCachedData, dispatch, query)

        await cacheEntryRemoved
        unsubCreated()
        unsubDeleted()
        eventUnsubs.forEach(fn => fn())
      }
    }),
    /** Общая лента: посты всех пользователей (с автором) */
    fetchAllPosts: build.query<TPost[], void>({
      query: () => ({ url: 'api/posts' }),
      providesTags: ['Posts'],
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        await cacheDataLoaded

        const userId = await getCookieUtil('userId')
        const query = { userId: +userId!, name: 'test' }

        const unsubCreated = subscribeToEvent<
          { message: string; post: TPost; timestamp: Date },
          typeof query
        >(
          SOCKET_EVENT_POSTS.POST_CREATED,
          data => {
            updateCachedData(draft => {
              draft.unshift(data.post)
            })
          },
          query
        )

        const unsubDeleted = subscribeToEvent<{ postId: number }, typeof query>(
          SOCKET_EVENT_POSTS.POST_DELETED,
          data => {
            updateCachedData(draft => {
              const idx = draft.findIndex(post => post.id === data.postId)
              if (idx !== -1) draft.splice(idx, 1)
            })
          },
          query
        )

        const eventUnsubs = subscribePostEvents(updateCachedData, dispatch, query)

        await cacheEntryRemoved
        unsubCreated()
        unsubDeleted()
        eventUnsubs.forEach(fn => fn())
      }
    }),
    fetchUserPosts: build.query<TPost[], number>({
      query: userId => ({ url: `api/posts/user/${userId}` }),
      providesTags: ['PostsUser']
    }),
    createPost: build.mutation<TPost, FormData>({
      query: formData => ({
        url: 'api/posts/add-post',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['PostsUser', 'Posts']
    }),
    deletePost: build.mutation<void, number>({
      query: postId => ({
        url: `api/posts/delete-post/${postId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['PostsUser', 'Posts']
    }),
    updatePost: build.mutation<TPost, { postId: number; content: string }>({
      query: ({ postId, content }) => ({
        url: `api/posts/${postId}`,
        method: 'PATCH',
        body: { content }
      }),
      invalidatesTags: ['PostsUser', 'Posts']
    }),

    toggleLike: build.mutation<{ liked: boolean; likesCount: number }, number>({
      query: postId => ({
        url: `api/posts/${postId}/like`,
        method: 'POST'
      }),
      // Оптимистичное обновление обеих лент (свои посты + общая), откат при ошибке
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const applyToggle = (draft: TPost[]) => {
          const post = draft.find(p => p.id === postId)
          if (post) {
            const liked = !post.likedByMe
            post.likedByMe = liked
            post.likesCount = Math.max(0, (post.likesCount ?? 0) + (liked ? 1 : -1))
          }
        }
        const patches = [
          dispatch(postsApi.util.updateQueryData('fetchPosts', undefined, applyToggle)),
          dispatch(postsApi.util.updateQueryData('fetchAllPosts', undefined, applyToggle))
        ]
        try {
          const { data } = await queryFulfilled
          // Сверяем с сервером
          const sync = (draft: TPost[]) => {
            const post = draft.find(p => p.id === postId)
            if (post) {
              post.likedByMe = data.liked
              post.likesCount = data.likesCount
            }
          }
          dispatch(postsApi.util.updateQueryData('fetchPosts', undefined, sync))
          dispatch(postsApi.util.updateQueryData('fetchAllPosts', undefined, sync))
        } catch {
          patches.forEach(p => p.undo())
        }
      }
    })
  }),
  overrideExisting: true
})

export const {
  useFetchPostsQuery,
  useFetchAllPostsQuery,
  useFetchUserPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useToggleLikeMutation
} = postsApi
