import { baseApi } from '@/app/api/_base-api'
import { subscribeToEvent } from '@/common/lib'
import { SOCKET_EVENT_FRIENDS } from '@/features/friends/constants'
import { getCookieUtil } from '@/common/utils'
import type { TUser } from '@/features/users/types'

/** Подписка на все друзья-события — при любом из них инвалидируем тег Friends */
const subscribeFriendsEvents = (dispatch: any, query: { userId: number; name: string }) => {
  const invalidate = () => {
    dispatch(friendsApi.util.invalidateTags(['Friends']))
  }

  const unsubSent = subscribeToEvent<
    { requesterId: number; addresseeId: number },
    typeof query
  >(SOCKET_EVENT_FRIENDS.FRIEND_REQUEST_SENT, invalidate, query)

  const unsubAccepted = subscribeToEvent<
    { requesterId: number; addresseeId: number },
    typeof query
  >(SOCKET_EVENT_FRIENDS.FRIEND_REQUEST_ACCEPTED, invalidate, query)

  const unsubRemoved = subscribeToEvent<
    { userId: number; targetId: number },
    typeof query
  >(SOCKET_EVENT_FRIENDS.FRIEND_REMOVED, invalidate, query)

  return [unsubSent, unsubAccepted, unsubRemoved]
}

export const friendsApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getFriends: build.query<TUser[], void>({
      query: () => ({ url: 'api/friends' }),
      providesTags: ['Friends'],
      async onCacheEntryAdded(_, { cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        await cacheDataLoaded
        const userId = await getCookieUtil('userId')
        const unsubs = subscribeFriendsEvents(dispatch, { userId: +userId!, name: 'test' })
        await cacheEntryRemoved
        unsubs.forEach(fn => fn())
      }
    }),
    getUserFriends: build.query<TUser[], number>({
      query: userId => ({ url: `api/friends/user/${userId}` }),
      providesTags: ['Friends']
    }),
    getIncomingRequests: build.query<TUser[], void>({
      query: () => ({ url: 'api/friends/requests/incoming' }),
      providesTags: ['Friends']
    }),
    getOutgoingRequests: build.query<TUser[], void>({
      query: () => ({ url: 'api/friends/requests/outgoing' }),
      providesTags: ['Friends']
    }),
    getSuggestions: build.query<TUser[], void>({
      query: () => ({ url: 'api/friends/suggestions' }),
      providesTags: ['Friends']
    }),
    sendFriendRequest: build.mutation<{ status: string }, number>({
      query: userId => ({ url: `api/friends/request/${userId}`, method: 'POST' }),
      invalidatesTags: ['Friends']
    }),
    acceptFriendRequest: build.mutation<{ status: string }, number>({
      query: userId => ({ url: `api/friends/accept/${userId}`, method: 'POST' }),
      invalidatesTags: ['Friends']
    }),
    removeFriend: build.mutation<{ message: string }, number>({
      query: userId => ({ url: `api/friends/${userId}`, method: 'DELETE' }),
      invalidatesTags: ['Friends']
    })
  })
})

export const {
  useGetFriendsQuery,
  useGetUserFriendsQuery,
  useGetIncomingRequestsQuery,
  useGetOutgoingRequestsQuery,
  useGetSuggestionsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRemoveFriendMutation
} = friendsApi
