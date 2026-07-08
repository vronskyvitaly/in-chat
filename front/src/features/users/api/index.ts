import { baseApi } from '@/app/api/_base-api'
import { subscribeToEvent } from '@/common/lib'
import { SOCKET_EVENT_USERS } from '@/features/users/constants'
import type { TUser } from '@/features/users/types'
import { getCookieUtil } from '@/common/utils'

const usersApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchUsers: build.query<TUser[], void>({
      query: () => ({ url: 'api/users/get-all' }),
      keepUnusedDataFor: 0,
      providesTags: ['Users'],
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
              const userIndex = draft.findIndex(u => u.id === data.user.id)
              if (userIndex !== -1) {
                draft[userIndex].isOnline = true
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
              const userIndex = draft.findIndex(u => u.id === data.user.id)
              if (userIndex !== -1) {
                draft[userIndex].isOnline = false
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

    fetchUserByEmail: build.query<TUser, string>({
      query: email => ({
        url: `api/users/by-email/${encodeURIComponent(email)}`
      }),
      providesTags: ['User']
    })
  })
})

export const { useFetchUsersQuery, useFetchUserByEmailQuery } = usersApi
