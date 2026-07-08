import type { TUser } from '@/features/users/types'
import type { ChangeEvent } from 'react'
import { SendFileToUserForm, SendMessageToUserForm, type TSendMessageSchemaValues } from '@/features/chat/ui'

type Props = {
  selectedUser: TUser
  onSendMessageHandler(data: TSendMessageSchemaValues): void
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  isLoadingData: boolean
}

export const AreaSubmitBlock = ({
  selectedUser,
  onSendMessageHandler,
  onFileChange,
  isLoadingData
}: Props) => {
  return (
    <div className='flex items-center gap-2 border-t border-gray-200/70 bg-white/70 p-4 backdrop-blur-sm'>
      <SendFileToUserForm onFileChange={onFileChange} />
      <SendMessageToUserForm
        selectedUser={selectedUser}
        onSendMessage={onSendMessageHandler}
        isLoadingData={isLoadingData}
      />
    </div>
  )
}
