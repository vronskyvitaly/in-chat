import { TUser } from '@/features/users/types'
import { useMemo } from 'react'
import { useFetchUsersQuery } from '@/features/users/api'
import { VkAvatar } from '@/common/pages/home-page/ui/vk/vk-avatar'

type Props = {
  selectedUser: TUser
}

export const AreaHeader = ({ selectedUser }: Props) => {
  const { data: users = [] } = useFetchUsersQuery()

  const selectedUserWithStatus = useMemo(() => {
    if (!selectedUser) return null
    return users.find(user => user.id === selectedUser.id)
  }, [users, selectedUser])

  return (
    <header className='border-b border-[#2a2a2b] bg-[#222222] p-4'>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <VkAvatar name={selectedUser.name} src={selectedUser.avatar} size={40} />
          {selectedUserWithStatus?.isOnline && (
            <div className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#222222] bg-[#4bb34b]'></div>
          )}
        </div>
        <div>
          <p className='font-semibold text-[#e1e3e6]'>{selectedUser.name}</p>
          {selectedUserWithStatus?.isOnline ? (
            <p className='text-sm font-medium text-[#4bb34b]'>
              Online
            </p>
          ) : (
            <p className='text-sm text-[#828282]'>Offline</p>
          )}
        </div>
      </div>
    </header>
  )
}
