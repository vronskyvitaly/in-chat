'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { TSendMessageSchemaValues } from '@/features/chat/ui/send-message-to-user-form/types'

export const sendMessageSchema = z.object({
  content: z.string().min(1, { message: 'Message must contain at least 1 character' })
})

export const useSendMessageToUserForm = () =>
  useForm<TSendMessageSchemaValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: ''
    },
    mode: 'onBlur'
  })
