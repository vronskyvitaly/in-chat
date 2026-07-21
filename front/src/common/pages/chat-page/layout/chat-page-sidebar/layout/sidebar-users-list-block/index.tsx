'use client'
import { useFilteredUsers } from '@/common/hooks'
import { useFetchUsersQuery } from '@/features/users/api'
import { useFetchUnreadCountsQuery } from '@/features/chat/api'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { VkAvatar } from '@/common/pages/home-page/ui/vk/vk-avatar'

type Props = {
  searchTerm: string
  currentUserId?: number
}

export const SidebarUsersListBlock = ({ searchTerm, currentUserId = 0 }: Props) => {
  const { data: users = [] } = useFetchUsersQuery()
  const { data: unread } = useFetchUnreadCountsQuery()
  const filteredUsers = useFilteredUsers(
    users.filter(user => user.id !== currentUserId),
    searchTerm as string
  )
  const selectedUserId = useParams().id

  return (
    <div className='flex-1 overflow-y-auto'>
      {/* Запас снизу, чтобы последний контакт не уходил под нижнюю панель навигации */}
      <div className='p-2 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-2'>
        <h3 className='px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#828282]'>Контакты</h3>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => {
            const unreadCount = unread?.bySender.find(s => s.senderId === user.id)?.count || 0
            return (
              <Link href={`/chat/${user.id}`} key={user.id} className='block'>
                <div
                  key={user.id}
                  className={`mb-1 flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all ${
                    +selectedUserId! === user.id
                      ? 'bg-[#2f2f30]'
                      : 'hover:bg-[#2a2a2b]'
                  }`}
                >
                  <div className='relative'>
                    <VkAvatar name={user.name} src={user.avatar} size={44} />
                    {user.isOnline && (
                      <div className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#222222] bg-[#4bb34b]' />
                    )}
                  </div>
                  <div className='min-w-0 flex-1 text-left'>
                    <p className='font-medium text-[#e1e3e6]'>{user.name}</p>
                    <p className={`text-sm ${user.isOnline ? 'text-[#4bb34b]' : 'text-[#828282]'}`}>
                      {user.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2688eb] px-1.5 text-xs font-medium text-white'>
                      {unreadCount}
                    </span>
                  )}
                </div>{' '}
              </Link>
            )
          })
        ) : (
          <div className='py-8 text-center text-[#828282]'>
            <p>Контакты не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
