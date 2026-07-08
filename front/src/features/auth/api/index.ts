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

        await cacheEntryRemoved
        unsubscribe3()
        unsubscribe4()
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
    })
  })
})

export const { useSignUpMutation, useMeQuery } = authApi
