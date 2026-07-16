'use client'
import { FaPaperPlane } from 'react-icons/fa'
import type { TUser } from '@/features/users/types'
import { type TSendMessageSchemaValues, useSendMessageToUserForm } from '@/features/chat/ui'

export const SendMessageToUserForm = ({
  onSendMessage,
  selectedUser,
  isLoadingData
}: {
  onSendMessage(data: TSendMessageSchemaValues): void
  selectedUser: TUser
  isLoadingData: boolean
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useSendMessageToUserForm()

  const onSubmit = (data: TSendMessageSchemaValues) => {
    if (data.content?.trim()) {
      onSendMessage(data)
      reset()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div>
        <div className='flex gap-2'>
          <textarea
            {...register('content')}
            onKeyPress={handleKeyPress}
            placeholder={selectedUser ? `Сообщение для ${selectedUser.name}` : 'Выберите пользователя'}
            className='flex-1 resize-none rounded-lg border border-transparent bg-[#2a2a2b] p-3 text-[#e1e3e6] placeholder:text-[#828282] focus:border-[#2688eb] focus:outline-none disabled:opacity-50'
            rows={1}
            disabled={!selectedUser || isLoadingData}
          />
          <button
            type='submit'
            className='rounded-lg bg-[#2688eb] px-5 py-2 text-white transition-colors hover:bg-[#2076d1] disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isLoadingData}
          >
            <FaPaperPlane />
          </button>
        </div>
        {errors.content && <p className='mt-1 text-sm text-red-400'>{errors.content.message}</p>}
      </div>
    </form>
  )
}
