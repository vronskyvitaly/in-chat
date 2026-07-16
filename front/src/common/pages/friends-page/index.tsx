'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { FiSearch, FiMessageCircle, FiUserPlus, FiCheck, FiX } from 'react-icons/fi'
import { PATH } from '@/common/constants'
import { useMeQuery } from '@/features/auth/api'
import { useFetchUsersQuery } from '@/features/users/api'
import {
  useGetFriendsQuery,
  useGetIncomingRequestsQuery,
  useGetOutgoingRequestsQuery,
  useGetSuggestionsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRemoveFriendMutation
} from '@/features/friends/api'
import { VkTopBar, VkLeftMenu, VkAvatar, VkPageSkeleton } from '@/common/pages/home-page/ui/vk'

type Section = 'friends' | 'incoming' | 'outgoing' | 'search'

export default function FriendsPage() {
  const { data: me } = useMeQuery()
  const { data: friends = [], isLoading } = useGetFriendsQuery()
  const { data: incoming = [] } = useGetIncomingRequestsQuery()
  const { data: outgoing = [] } = useGetOutgoingRequestsQuery()
  const { data: suggestions = [] } = useGetSuggestionsQuery()
  const { data: allUsers = [] } = useFetchUsersQuery()

  const [sendRequest] = useSendFriendRequestMutation()
  const [acceptRequest] = useAcceptFriendRequestMutation()
  const [removeFriend] = useRemoveFriendMutation()

  const [section, setSection] = useState<Section>('friends')
  const [search, setSearch] = useState('')

  const onlineCount = friends.filter(f => f.isOnline).length

  // Friends filtered by search
  const visibleFriends = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return friends
    return friends.filter(f => f.name.toLowerCase().includes(q))
  }, [friends, search])

  // All users for "Поиск друзей" — exclude self, friends, incoming, outgoing
  const searchableUsers = useMemo(() => {
    const friendIds = new Set(friends.map(f => f.id))
    const incomingIds = new Set(incoming.map(u => u.id))
    const outgoingIds = new Set(outgoing.map(u => u.id))
    const others = allUsers.filter(
      u => u.id !== me?.id && !friendIds.has(u.id) && !incomingIds.has(u.id) && !outgoingIds.has(u.id)
    )
    const q = search.trim().toLowerCase()
    if (!q) return others
    return others.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [allUsers, friends, incoming, outgoing, me?.id, search])

  // Incoming filtered
  const visibleIncoming = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return incoming
    return incoming.filter(u => u.name.toLowerCase().includes(q))
  }, [incoming, search])

  // Outgoing filtered
  const visibleOutgoing = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return outgoing
    return outgoing.filter(u => u.name.toLowerCase().includes(q))
  }, [outgoing, search])

  if (isLoading) return <VkPageSkeleton variant='friends' />

  const handle = async (fn: () => Promise<unknown>, ok: string) => {
    try {
      await fn()
      toast.success(ok)
    } catch {
      toast.error('Не удалось выполнить действие')
    }
  }

  const placeholders: Record<Section, string> = {
    friends: 'Поиск среди друзей',
    incoming: 'Поиск среди заявок',
    outgoing: 'Поиск среди исходящих',
    search: 'Поиск людей'
  }

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar name={me?.name} avatar={me?.avatar} />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        <VkLeftMenu />

        {/* Центральная колонка */}
        <div className='min-w-0 flex-1 space-y-3'>
          {/* Поиск */}
          <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
            {section === 'friends' && (
              <div className='mb-3 flex items-center gap-2'>
                <button
                  className='rounded-lg bg-[#2f2f30] px-3 py-1.5 text-sm font-medium text-[#e1e3e6]'
                >
                  Все друзья <span className='text-[#828282]'>{friends.length}</span>
                </button>
                <span className='text-sm text-[#828282]'>
                  Онлайн <span>{onlineCount}</span>
                </span>
              </div>
            )}
            {section === 'incoming' && (
              <p className='mb-3 text-sm font-semibold text-[#e1e3e6]'>
                Заявки в друзья <span className='text-[#828282]'>{incoming.length}</span>
              </p>
            )}
            {section === 'outgoing' && (
              <p className='mb-3 text-sm font-semibold text-[#e1e3e6]'>
                Исходящие заявки <span className='text-[#828282]'>{outgoing.length}</span>
              </p>
            )}
            {section === 'search' && (
              <p className='mb-3 text-sm font-semibold text-[#e1e3e6]'>
                Поиск друзей
              </p>
            )}
            <div className='relative'>
              <FiSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#828282]' />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={placeholders[section]}
                className='w-full rounded-lg border border-transparent bg-[#2a2a2b] py-2.5 pl-10 pr-4 text-sm text-[#e1e3e6] placeholder:text-[#828282] focus:border-[#2688eb] focus:outline-none'
              />
            </div>
          </div>

          {/* === Раздел: Мои друзья === */}
          {section === 'friends' && (
            <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
              {visibleFriends.length > 0 ? (
                <div className='space-y-1'>
                  {visibleFriends.map(user => (
                    <div key={user.id} className='flex items-center gap-3 rounded-lg p-2 hover:bg-[#2a2a2b]'>
                      <Link href={`${PATH.USERS}/${user.id}`} className='relative shrink-0'>
                        <VkAvatar name={user.name} src={user.avatar} size={56} />
                        {user.isOnline && (
                          <span className='absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[#222222] bg-[#4bb34b]' />
                        )}
                      </Link>
                      <div className='min-w-0 flex-1'>
                        <Link href={`${PATH.USERS}/${user.id}`} className='truncate font-medium text-[#e1e3e6] hover:text-[#5b9bea]'>
                          {user.name}
                        </Link>
                        <p className='truncate text-sm text-[#828282]'>
                          {user.isOnline ? 'Online' : user.city || 'Offline'}
                        </p>
                        <div className='mt-1 flex items-center gap-4 text-sm'>
                          <Link
                            href={`${PATH.CHAT}/${user.id}`}
                            className='flex items-center gap-1.5 text-[#5b9bea] hover:underline'
                          >
                            <FiMessageCircle className='h-4 w-4' /> Написать сообщение
                          </Link>
                          <button
                            onClick={() => handle(() => removeFriend(user.id).unwrap(), 'Удалён из друзей')}
                            className='text-[#828282] hover:text-[#e1e3e6]'
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='py-8 text-center text-[#828282]'>
                  {search ? 'Никого не найдено' : 'У вас пока нет друзей'}
                </p>
              )}
            </div>
          )}

          {/* === Раздел: Входящие заявки === */}
          {section === 'incoming' && (
            <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
              {visibleIncoming.length > 0 ? (
                <div className='space-y-1'>
                  {visibleIncoming.map(user => (
                    <div key={user.id} className='flex items-center gap-3 rounded-lg p-2'>
                      <Link href={`${PATH.USERS}/${user.id}`} className='shrink-0'>
                        <VkAvatar name={user.name} src={user.avatar} size={48} />
                      </Link>
                      <div className='min-w-0 flex-1'>
                        <Link href={`${PATH.USERS}/${user.id}`} className='truncate font-medium text-[#e1e3e6] hover:text-[#5b9bea]'>
                          {user.name}
                        </Link>
                        <p className='truncate text-sm text-[#828282]'>{user.status || 'хочет добавить вас в друзья'}</p>
                      </div>
                      <button
                        onClick={() => handle(() => acceptRequest(user.id).unwrap(), 'Заявка принята')}
                        className='flex items-center gap-1.5 rounded-lg bg-[#2688eb] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#2076d1]'
                      >
                        <FiCheck className='h-4 w-4' /> Принять
                      </button>
                      <button
                        onClick={() => handle(() => removeFriend(user.id).unwrap(), 'Заявка отклонена')}
                        className='flex items-center gap-1.5 rounded-lg bg-[#2f2f30] px-3 py-1.5 text-sm font-medium text-[#e1e3e6] hover:bg-[#3a3a3b]'
                      >
                        <FiX className='h-4 w-4' /> Отклонить
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='py-8 text-center text-[#828282]'>
                  {search ? 'Никого не найдено' : 'Нет входящих заявок'}
                </p>
              )}
            </div>
          )}

          {/* === Раздел: Исходящие заявки === */}
          {section === 'outgoing' && (
            <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
              {visibleOutgoing.length > 0 ? (
                <div className='space-y-1'>
                  {visibleOutgoing.map(user => (
                    <div key={user.id} className='flex items-center gap-3 rounded-lg p-2'>
                      <Link href={`${PATH.USERS}/${user.id}`} className='shrink-0'>
                        <VkAvatar name={user.name} src={user.avatar} size={48} />
                      </Link>
                      <div className='min-w-0 flex-1'>
                        <Link href={`${PATH.USERS}/${user.id}`} className='truncate font-medium text-[#e1e3e6] hover:text-[#5b9bea]'>
                          {user.name}
                        </Link>
                        <p className='truncate text-sm text-[#828282]'>Заявка отправлена</p>
                      </div>
                      <button
                        onClick={() => handle(() => removeFriend(user.id).unwrap(), 'Заявка отменена')}
                        className='flex items-center gap-1.5 rounded-lg bg-[#2f2f30] px-3 py-1.5 text-sm font-medium text-[#e1e3e6] hover:bg-[#3a3a3b]'
                      >
                        <FiX className='h-4 w-4' /> Отменить
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='py-8 text-center text-[#828282]'>
                  {search ? 'Никого не найдено' : 'Нет исходящих заявок'}
                </p>
              )}
            </div>
          )}

          {/* === Раздел: Поиск друзей === */}
          {section === 'search' && (
            <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
              {searchableUsers.length > 0 ? (
                <div className='space-y-1'>
                  {searchableUsers.map(user => (
                    <div key={user.id} className='flex items-center gap-3 rounded-lg p-2 hover:bg-[#2a2a2b]'>
                      <Link href={`${PATH.USERS}/${user.id}`} className='relative shrink-0'>
                        <VkAvatar name={user.name} src={user.avatar} size={56} />
                        {user.isOnline && (
                          <span className='absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[#222222] bg-[#4bb34b]' />
                        )}
                      </Link>
                      <div className='min-w-0 flex-1'>
                        <Link href={`${PATH.USERS}/${user.id}`} className='truncate font-medium text-[#e1e3e6] hover:text-[#5b9bea]'>
                          {user.name}
                        </Link>
                        <p className='truncate text-sm text-[#828282]'>
                          {user.isOnline ? 'Online' : user.city || user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => handle(() => sendRequest(user.id).unwrap(), 'Заявка отправлена')}
                        className='flex items-center gap-1.5 rounded-lg bg-[#2688eb] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2076d1]'
                      >
                        <FiUserPlus className='h-4 w-4' /> Добавить
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='py-8 text-center text-[#828282]'>
                  {search ? 'Никого не найдено' : 'Нет пользователей для добавления'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Правая колонка — навигация по разделам */}
        <aside className='sticky top-[72px] hidden max-h-[calc(100vh-88px)] w-[280px] shrink-0 space-y-3 self-start overflow-y-auto xl:block'>
          <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-2 text-sm'>
            <button
              onClick={() => { setSection('friends'); setSearch('') }}
              className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                section === 'friends' ? 'bg-[#2f2f30] font-medium text-[#e1e3e6]' : 'text-[#aeb0b3] hover:bg-[#232324] hover:text-[#e1e3e6]'
              }`}
            >
              Мои друзья
            </button>
            <button
              onClick={() => { setSection('incoming'); setSearch('') }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                section === 'incoming' ? 'bg-[#2f2f30] font-medium text-[#e1e3e6]' : 'text-[#aeb0b3] hover:bg-[#232324] hover:text-[#e1e3e6]'
              }`}
            >
              <span>Заявки в друзья</span>
              {incoming.length > 0 && (
                <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2688eb] px-1.5 text-xs font-medium text-white'>
                  {incoming.length}
                </span>
              )}
            </button>
            <button
              onClick={() => { setSection('outgoing'); setSearch('') }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                section === 'outgoing' ? 'bg-[#2f2f30] font-medium text-[#e1e3e6]' : 'text-[#aeb0b3] hover:bg-[#232324] hover:text-[#e1e3e6]'
              }`}
            >
              <span>Исходящие заявки</span>
              {outgoing.length > 0 && <span className='text-[#828282]'>{outgoing.length}</span>}
            </button>
            <button
              onClick={() => { setSection('search'); setSearch('') }}
              className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                section === 'search' ? 'bg-[#2f2f30] font-medium text-[#e1e3e6]' : 'text-[#aeb0b3] hover:bg-[#232324] hover:text-[#e1e3e6]'
              }`}
            >
              Поиск друзей
            </button>
          </div>

          {/* Возможные друзья */}
          {suggestions.length > 0 && (
            <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
              <p className='mb-3 font-medium text-[#e1e3e6]'>Возможные друзья</p>
              <div className='space-y-3'>
                {suggestions.map(user => {
                  const requested = outgoing.some(o => o.id === user.id)
                  return (
                    <div key={user.id} className='flex items-center gap-3'>
                      <Link href={`${PATH.USERS}/${user.id}`} className='shrink-0'>
                        <VkAvatar name={user.name} src={user.avatar} size={40} />
                      </Link>
                      <div className='min-w-0 flex-1'>
                        <Link href={`${PATH.USERS}/${user.id}`} className='block truncate text-sm font-medium text-[#e1e3e6] hover:text-[#5b9bea]'>
                          {user.name}
                        </Link>
                        <p className='truncate text-xs text-[#828282]'>{user.city || 'Возможно, вы знакомы'}</p>
                      </div>
                      <button
                        disabled={requested}
                        onClick={() => handle(() => sendRequest(user.id).unwrap(), 'Заявка отправлена')}
                        title={requested ? 'Заявка отправлена' : 'Добавить в друзья'}
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-[#5b9bea] transition-colors hover:bg-[#2a2a2b] disabled:text-[#4bb34b] disabled:hover:bg-transparent'
                      >
                        {requested ? <FiCheck className='h-5 w-5' /> : <FiUserPlus className='h-5 w-5' />}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
