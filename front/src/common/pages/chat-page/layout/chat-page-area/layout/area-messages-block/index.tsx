'use client'
import { useEffect, useRef } from 'react'
import { useFetchUserChatQuery } from '@/features/chat/api'
import type { TUser } from '@/features/users/types'
import Image from 'next/image'
import { MessagesBlockIsLoadingData } from './ui'
import { formatTimeUtil } from '@/common/utils'

type Props = {
  selectedUser: TUser
  isLoadingData: boolean
}

export const AreaMessagesBlock = ({ selectedUser, isLoadingData }: Props) => {
  const { data: chat } = useFetchUserChatQuery({ targetUserId: String(selectedUser?.id) || '0' })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  if (isLoadingData) {
    return <MessagesBlockIsLoadingData />
  }

  return (
    <div className='flex-1 space-y-1 overflow-y-auto p-4'>
      {chat?.messages && chat.messages.length > 0 ? (
        chat.messages.map(message => {
          const isIncoming = message.senderId === selectedUser.id
          return (
            <div
              key={message.id}
              className={`flex mb-3 ${isIncoming ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2.5 shadow-sm ${
                  isIncoming
                    ? 'rounded-2xl rounded-bl-md border border-gray-100 bg-white text-gray-800'
                    : 'rounded-2xl rounded-br-md bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                }`}
              >
                {message.content && <p className='leading-relaxed break-words'>{message.content}</p>}
                {message.imageUrl && (
                  <Image
                    src={message.imageUrl}
                    width={200}
                    height={200}
                    alt='Message Image'
                    className='mt-2 rounded-xl'
                  />
                )}
                <p className={`mt-1 text-xs ${isIncoming ? 'text-gray-400' : 'text-blue-100'}`}>
                  {formatTimeUtil(message.createdAt, 'timeAndDate')}
                </p>
              </div>
            </div>
          )
        })
      ) : (
        <div className='flex h-full flex-col items-center justify-center text-center text-gray-400'>
          <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100'>
            <svg className='h-7 w-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.8}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.05-3.15A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
          </div>
          <p className='font-medium'>Сообщений пока нет</p>
          <p className='text-sm text-gray-400'>Начните диалог первым</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
