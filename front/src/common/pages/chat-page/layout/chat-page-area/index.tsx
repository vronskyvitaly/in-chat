'use client'
import { useEffect } from 'react'
import { useFetchUserChatQuery, useSendFileMutation, useSendMessageMutation, useMarkChatAsReadMutation } from '@/features/chat/api'
import { useFetchUsersQuery } from '@/features/users/api'
import type { TSendMessageSchemaValues } from '@/features/chat/ui/send-message-to-user-form/types'
import type { ChangeEvent } from 'react'
import axios from 'axios'
import { AreaHeader, AreaMessagesBlock, AreaSubmitBlock } from './layout'

type Props = {
  selectedUserId: string
}

export const ChatPageArea = ({ selectedUserId }: Props) => {
  const { data: chat, isLoading: isLoadingChat } = useFetchUserChatQuery({
    targetUserId: selectedUserId || '0'
  })
  const [sendMessageMutation] = useSendMessageMutation()
  const [sendFileMutation] = useSendFileMutation()
  const [markChatAsRead] = useMarkChatAsReadMutation()
  const { data: users, isLoading: isLoadingUsers } = useFetchUsersQuery()

  useEffect(() => {
    if (chat?.id) {
      markChatAsRead(chat.id)
    }
  }, [chat?.id, chat?.messages?.length, markChatAsRead])

  const isLoadingData = isLoadingChat || isLoadingUsers

  if (!users) return null

  const user = users.find(user => user.id === Number(selectedUserId))

  if (!user) return null

  const sendMessageHandler = async (data: TSendMessageSchemaValues) => {
    if (!selectedUserId || !chat) return
    await sendMessageMutation({
      chatId: chat.id,
      content: data.content.trim()
    }).unwrap()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const input = event.target as HTMLInputElement
      if (input && input.files?.length && input.files.length > 0 && chat) {
        const file = input.files[0]
        const formData = new FormData()
        formData.set('file', file)
        formData.set('chatId', chat.id)
        sendFileMutation(formData)
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log('src/features/chat/ui/chat-page-area/index.tsx', e.response?.data)
      }
    }
  }

  return (
    <div className='flex-1 flex flex-col min-h-0'>
      {/* Chat Header */}
      <AreaHeader selectedUser={user} />
      {/* Messages Area */}
      <AreaMessagesBlock selectedUser={user} isLoadingData={isLoadingData} />
      {/* Send message form */}
      <AreaSubmitBlock
        isLoadingData={isLoadingData}
        selectedUser={user}
        onSendMessageHandler={sendMessageHandler}
        onFileChange={handleFileChange}
      />
    </div>
  )
}
