'use client'
import { useEffect, useRef } from 'react'
import { useFetchUserChatQuery } from '@/features/chat/api'
import type { TUser } from '@/features/users/types'
import Image from 'next/image'
import { MessagesBlockIsLoadingData } from './ui'
import { formatTimeUtil } from '@/common/utils'
import { VkAvatar } from '@/common/pages/home-page/ui/vk/vk-avatar'

type Props = {
  selectedUser: TUser
  isLoadingData: boolean
}

export const AreaMessagesBlock = ({ selectedUser, isLoadingData }: Props) => {
  const { data: chat } = useFetchUserChatQuery({ targetUserId: String(selectedUser?.id) || '0' })
  const containerRef = useRef<HTMLDivElement>(null)
  const prevMessagesLenRef = useRef(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const len = chat?.messages?.length ?? 0
    const isInitial = prevMessagesLenRef.current === 0 && len > 0
    prevMessagesLenRef.current = len

    if (isInitial) {
      // При первом открытии чата — мгновенный скролл до конца
      el.scrollTop = el.scrollHeight
    } else {
      // При новых сообщениях — плавный скролл
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [chat?.messages])

  if (isLoadingData) {
    return <MessagesBlockIsLoadingData />
  }

  return (
    <div ref={containerRef} className='flex-1 space-y-1 overflow-y-auto bg-[#19191a] p-4'>
      {chat?.messages && chat.messages.length > 0 ? (
        chat.messages.map((message, idx) => {
          const isIncoming = message.senderId === selectedUser.id
          const prevMessage = chat.messages[idx - 1]
          const nextMessage = chat.messages[idx + 1]
          const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId
          const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId

          const time = formatTimeUtil(message.createdAt, 'timeAndDate')

          // Скругления: на последнем сообщении в группе — угол без скругления (там будет усик)
          const incomingRound = isLastInGroup ? 'rounded-2xl rounded-bl-none' : 'rounded-2xl rounded-bl-sm'
          const outgoingRound = isLastInGroup ? 'rounded-2xl rounded-br-none' : 'rounded-2xl rounded-br-sm'

          const tail = isLastInGroup && (
            isIncoming ? (
              <svg className='absolute -left-[6px] bottom-0' width='6' height='12' viewBox='0 0 6 12'>
                <path d='M6 0 C6 6 0 12 0 12 L6 12 Z' fill='#252526' />
              </svg>
            ) : (
              <svg className='absolute -right-[6px] bottom-0' width='6' height='12' viewBox='0 0 6 12'>
                <path d='M0 0 C0 6 6 12 6 12 L0 12 Z' fill='#1b6fd1' />
              </svg>
            )
          )

          const bubble = message.imageUrl ? (
            <div className='relative'>
              <div
                className={`max-w-[300px] overflow-hidden shadow-md ${
                  isIncoming
                    ? `${incomingRound} bg-[#252526] border border-[#2f2f30]`
                    : `${outgoingRound} bg-gradient-to-br from-[#2688eb] to-[#1b6fd1]`
                }`}
              >
                {isFirstInGroup && (
                  <p className={`px-3.5 pt-2.5 pb-0.5 text-[13px] font-semibold ${
                    isIncoming ? 'text-[#5b9bea]' : 'text-white/80'
                  }`}>
                    {message.sender.name}
                  </p>
                )}
                {message.content && (
                  <p className={`px-3.5 pt-1 pb-1 text-[15px] leading-relaxed break-words ${
                    isIncoming ? 'text-[#e1e3e6]' : 'text-white'
                  }`}>
                    {message.content}
                  </p>
                )}
                <div className='relative'>
                  <Image
                    src={message.imageUrl}
                    width={300}
                    height={300}
                    alt='Image'
                    className='block w-full object-cover'
                    style={{ maxHeight: 340 }}
                  />
                  <div className='absolute bottom-0 left-0 right-0 flex items-end px-3 pb-2 pt-8 bg-gradient-to-t from-black/50 to-transparent'>
                    <span className='ml-auto text-[11px] text-white/80 drop-shadow'>
                      {time}
                    </span>
                  </div>
                </div>
              </div>
              {tail}
            </div>
          ) : (
            <div className='relative'>
              <div
                className={`max-w-sm shadow-md ${
                  isIncoming
                    ? `${incomingRound} bg-[#252526] border border-[#2f2f30] text-[#e1e3e6]`
                    : `${outgoingRound} bg-gradient-to-br from-[#2688eb] to-[#1b6fd1] text-white`
                }`}
              >
                {isFirstInGroup && (
                  <p className={`px-3.5 pt-2.5 text-[13px] font-semibold ${
                    isIncoming ? 'text-[#5b9bea]' : 'text-white/80'
                  }`}>
                    {message.sender.name}
                  </p>
                )}
                <div className={`px-3.5 ${isFirstInGroup ? 'pt-1' : 'pt-2.5'} pb-1.5`}>
                  <p className='text-[15px] leading-relaxed break-words'>{message.content}</p>
                  <p className={`mt-1 text-[11px] ${
                    isIncoming ? 'text-[#666]' : 'text-right text-blue-100/70'
                  }`}>
                    {time}
                  </p>
                </div>
              </div>
              {tail}
            </div>
          )

          return (
            <div
              key={message.id}
              className={`flex ${isFirstInGroup ? 'mt-4' : 'mt-0.5'} ${isIncoming ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-end gap-0.5 ${isIncoming ? '' : 'flex-row-reverse'}`}>
                <div className='w-8 shrink-0'>
                  {isLastInGroup && (
                    <VkAvatar name={message.sender.name} src={message.sender.avatar} size={32} />
                  )}
                </div>
                <div className='min-w-0'>
                  {bubble}
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <div className='flex h-full flex-col items-center justify-center text-center text-[#828282]'>
          <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#2a2a2b]'>
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
          <p className='text-sm text-[#828282]'>Начните диалог первым</p>
        </div>
      )}
    </div>
  )
}
