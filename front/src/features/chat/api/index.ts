import { baseApi } from '@/app/api/_base-api'
import { SOCKET_EVENT_CHAT } from '@/features/chat/constants'
import { subscribeToEvent } from '@/common/lib'
import type { TChatMessage, TResponseFetchUserChat, TUnreadCounts } from '@/features/chat/types'
import { getCookieUtil } from '@/common/utils'

const chatApi = baseApi.injectEndpoints({
  endpoints: build => ({
    fetchUserChat: build.query<TResponseFetchUserChat, { targetUserId: string }>({
      query: ({ targetUserId }) => ({
        url: 'api/chat',
        params: { targetUserId }
      }),
      keepUnusedDataFor: 0,
      providesTags: ['Chat'],
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded

        const userId = await getCookieUtil('userId')

        const unsubscribe4 = subscribeToEvent<{ message: TChatMessage }, { userId: number; name: string }>(
          SOCKET_EVENT_CHAT.CHAT_MESSAGE,
          data => {
            updateCachedData(draft => {
              draft.messages.push(data.message)
            })
          },
          { userId: +userId!, name: 'test' }
        )

        await cacheEntryRemoved
        unsubscribe4()
      }
    }),
    fetchUnreadCounts: build.query<TUnreadCounts, void>({
      query: () => ({ url: 'api/chat/unread' }),
      providesTags: ['UnreadCounts'],
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded

        const userId = await getCookieUtil('userId')

        const unsubscribe = subscribeToEvent<{ message: TChatMessage }, { userId: number; name: string }>(
          SOCKET_EVENT_CHAT.CHAT_MESSAGE,
          data => {
            if (data.message.senderId !== +userId!) {
              updateCachedData(draft => {
                draft.totalCount += 1
                const entry = draft.bySender.find(s => s.senderId === data.message.senderId)
                if (entry) {
                  entry.count += 1
                } else {
                  draft.bySender.push({ senderId: data.message.senderId, count: 1 })
                }
              })
            }
          },
          { userId: +userId!, name: 'test' }
        )

        await cacheEntryRemoved
        unsubscribe()
      }
    }),
    markChatAsRead: build.mutation<{ updated: number }, string>({
      query: chatId => ({
        url: `api/chat/read/${chatId}`,
        method: 'PUT'
      }),
      invalidatesTags: ['UnreadCounts']
    }),
    sendMessage: build.mutation<TChatMessage, { chatId: string; content: string }>({
      query: ({ chatId, content }) => ({
        url: 'api/chat/message',
        method: 'POST',
        body: { chatId, content }
      })
    }),
    sendFile: build.mutation<TChatMessage, FormData>({
      query: formData => ({
        url: 'api/chat/image',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    })
  })
})

export const {
  useFetchUserChatQuery,
  useFetchUnreadCountsQuery,
  useMarkChatAsReadMutation,
  useSendMessageMutation,
  useSendFileMutation
} = chatApi
