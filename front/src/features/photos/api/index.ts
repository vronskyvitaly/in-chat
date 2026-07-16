import { baseApi } from '@/app/api/_base-api'
import { subscribeToEvent } from '@/common/lib'
import { SOCKET_EVENT_PHOTOS } from '@/features/photos/constants'
import { getCookieUtil } from '@/common/utils'

export type TPhoto = {
  id: number
  url: string
  userId: number
  createdAt: string
}

export type TPhotoComment = {
  id: number
  content: string
  photoId: number
  authorId: number
  createdAt: string
  author: {
    id: number
    name: string
    avatar: string | null
  }
}

export const photosApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getMyPhotos: build.query<TPhoto[], void>({
      query: () => ({ url: 'api/photos' }),
      providesTags: ['Photos']
    }),
    getUserPhotos: build.query<TPhoto[], number>({
      query: userId => ({ url: `api/photos/user/${userId}` })
    }),
    uploadPhotos: build.mutation<TPhoto[], FormData>({
      query: formData => ({
        url: 'api/photos/upload',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Photos']
    }),
    deletePhoto: build.mutation<void, number>({
      query: photoId => ({
        url: `api/photos/${photoId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Photos']
    }),
    getPhotoComments: build.query<TPhotoComment[], number>({
      query: photoId => ({ url: `api/photos/${photoId}/comments` }),
      providesTags: (_result, _err, photoId) => [{ type: 'PhotoComments', id: photoId }],
      async onCacheEntryAdded(photoId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded

        const userId = await getCookieUtil('userId')
        const query = { userId: +userId!, name: 'test' }

        const unsub = subscribeToEvent<{ photoId: number; comment: TPhotoComment }, typeof query>(
          SOCKET_EVENT_PHOTOS.PHOTO_COMMENT_CREATED,
          data => {
            if (data.photoId === photoId) {
              updateCachedData(draft => {
                if (!draft.find(c => c.id === data.comment.id)) {
                  draft.push(data.comment)
                }
              })
            }
          },
          query
        )

        await cacheEntryRemoved
        unsub()
      }
    }),
    addPhotoComment: build.mutation<TPhotoComment, { photoId: number; content: string }>({
      query: ({ photoId, content }) => ({
        url: `api/photos/${photoId}/comments`,
        method: 'POST',
        body: { content }
      })
    })
  }),
  overrideExisting: true
})

export const {
  useGetMyPhotosQuery,
  useGetUserPhotosQuery,
  useUploadPhotosMutation,
  useDeletePhotoMutation,
  useGetPhotoCommentsQuery,
  useAddPhotoCommentMutation
} = photosApi
