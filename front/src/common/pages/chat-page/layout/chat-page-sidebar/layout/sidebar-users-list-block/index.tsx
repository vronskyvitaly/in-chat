'use client'
import { useFilteredUsers } from '@/common/hooks'
import { useFetchUsersQuery } from '@/features/users/api'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Props = {
  searchTerm: string
  currentUserId?: number
}

export const SidebarUsersListBlock = ({ searchTerm, currentUserId = 0 }: Props) => {
  const { data: users = [] } = useFetchUsersQuery()
  const filteredUsers = useFilteredUsers(
    users.filter(user => user.id !== currentUserId),
    searchTerm as string
  )
  const selectedUserId = useParams().id

  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='p-2'>
        <h3 className='px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400'>Контакты</h3>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => {
            return (
              <Link href={`/chat/${user.id}`} key={user.id} className='block'>
                <div
                  key={user.id}
                  className={`mb-1 flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all ${
                    +selectedUserId! === user.id
                      ? 'bg-blue-50 shadow-sm ring-1 ring-blue-200'
                      : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className='relative'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-sm'>
                      <span className='font-medium text-white'>
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    {/* Green dot for online status */}
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 ${user.isOnline ? 'block' : 'hidden'}`}
                    ></div>
                  </div>
                  <div className='text-left'>
                    <p className='font-medium text-gray-900'>{user.name}</p>
                    <p className={`text-sm ${user.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                      {user.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>{' '}
              </Link>
            )
          })
        ) : (
          <div className='py-8 text-center text-gray-400'>
            <p>Контакты не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
