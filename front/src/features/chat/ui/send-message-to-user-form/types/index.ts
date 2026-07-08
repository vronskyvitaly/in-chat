import { z } from 'zod'
import { sendMessageSchema } from '@/features/chat/ui/send-message-to-user-form/hook'

export type TSendMessageSchemaValues = z.infer<typeof sendMessageSchema>
