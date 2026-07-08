import { baseApi } from '@/app/api/_base-api'
import { SOCKET_EVENT_CHAT } from '@/features/chat/constants'
import { subscribeToEvent } from '@/common/lib'
import type { TChatMessage, TResponseFetchUserChat } from '@/features/chat/types'
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
    sendMessage: build.mutation<TChatMessage, { chatId: string; content: string }>({
      query: ({ chatId, content }) => ({
        url: 'api/chat/message',
        method: 'POST',
        body: { chatId, content }
      }),
      invalidatesTags: ['Chat']
    }),
    sendFile: build.mutation<TChatMessage, FormData>({
      query: formData => ({
        url: 'api/chat/image',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
      invalidatesTags: ['Chat']
    })
  })
})

export const { useFetchUserChatQuery, useSendMessageMutation, useSendFileMutation } = chatApi
