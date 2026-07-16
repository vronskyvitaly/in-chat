import { baseApi } from '@/app/api/_base-api'
import { subscribeToEvent } from '@/common/lib'
import type { TUser } from '@/features/users/types'
import { SOCKET_EVENT_USERS } from '@/features/users/constants'
import { getCookieUtil } from '@/common/utils/get-cookie-util'

const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    me: build.query<TUser, void>({
      query: () => ({ url: 'api/auth/me' }),
      keepUnusedDataFor: 0,
      providesTags: ['Auth'],
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded

        const userId = await getCookieUtil('userId')

        const unsubscribe4 = subscribeToEvent<
          { user: TUser; onlineCount: number },
          { userId: number; name: string }
        >(
          SOCKET_EVENT_USERS.USER_ONLINE,
          data => {
            updateCachedData(draft => {
              if (draft?.id === data.user.id) {
                draft.isOnline = true
              }
            })
          },
          { userId: +userId!, name: 'test' }
        )

        const unsubscribe3 = subscribeToEvent<
          { user: TUser; onlineCount: number },
          { userId: number; name: string }
        >(
          SOCKET_EVENT_USERS.USER_OFFLINE,
          data => {
            updateCachedData(draft => {
              if (draft?.id === data.user.id) {
                draft.isOnline = false
              }
            })
          },
          { userId: +userId!, name: 'test' }
        )

        const unsubscribeUpdated = subscribeToEvent<
          { user: TUser },
          { userId: number; name: string }
        >(
          SOCKET_EVENT_USERS.USER_UPDATED,
          data => {
            updateCachedData(draft => {
              if (draft?.id === data.user.id) {
                Object.assign(draft, data.user)
              }
            })
          },
          { userId: +userId!, name: 'test' }
        )

        await cacheEntryRemoved
        unsubscribe3()
        unsubscribe4()
        unsubscribeUpdated()
      }
    }),

    signUp: build.mutation<
      { message: string; userId: number },
      Pick<TUser, 'name' | 'email'> & { password: string }
    >({
      query: userData => ({
        url: 'api/auth/sign-up',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['Users', 'Auth']
    }),

    updateProfile: build.mutation<
      TUser,
      Partial<Pick<TUser, 'name' | 'status' | 'city' | 'maritalStatus' | 'languages'>> & {
        coverColor?: string
        removeCover?: boolean
      }
    >({
      query: body => ({
        url: 'api/auth/update-profile',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Users', 'Auth']
    }),

    uploadAvatar: build.mutation<TUser, FormData>({
      query: formData => ({
        url: 'api/auth/upload-avatar',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Users', 'Auth']
    }),

    uploadCover: build.mutation<TUser, FormData>({
      query: formData => ({
        url: 'api/auth/upload-cover',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Users', 'Auth']
    })
  })
})

export const {
  useSignUpMutation,
  useMeQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUploadCoverMutation
} = authApi
