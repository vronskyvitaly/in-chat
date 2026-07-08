import { TUser } from '@/features/users/types'
import { useMemo } from 'react'
import { useFetchUsersQuery } from '@/features/users/api'

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
    <header className='border-b border-gray-200/70 bg-white/70 p-4 backdrop-blur-sm'>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 shadow-sm'>
            <span className='font-medium text-white'>
              {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          {selectedUserWithStatus?.isOnline && (
            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
          )}
        </div>
        <div>
          <p className='font-semibold text-gray-900'>{selectedUser.name}</p>
          {selectedUserWithStatus?.isOnline ? (
            <p className='flex items-center gap-1.5 text-sm font-medium text-green-600'>
              <span className='inline-block h-1.5 w-1.5 rounded-full bg-green-500'></span>
              Online
            </p>
          ) : (
            <p className='text-sm text-gray-400'>Offline</p>
          )}
        </div>
      </div>
    </header>
  )
}
