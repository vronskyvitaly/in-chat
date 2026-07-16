'use client'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiSearch, FiMessageCircle } from 'react-icons/fi'
import { PATH } from '@/common/constants'
import { useMeQuery } from '@/features/auth/api'
import { useFetchUsersQuery } from '@/features/users/api'
import { VkTopBar, VkLeftMenu, VkAvatar, VkPageSkeleton } from '@/common/pages/home-page/ui/vk'

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const { data: me } = useMeQuery()
  const { data: users = [], isLoading } = useFetchUsersQuery()
  const [search, setSearch] = useState(initialQuery)

  const filtered = useMemo(() => {
    const others = users.filter(u => u.id !== me?.id)
    const q = search.trim().toLowerCase()
    if (!q) return others
    return others.filter(
      u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }, [users, search, me?.id])

  if (isLoading) return <VkPageSkeleton variant='search' />

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar name={me?.name} avatar={me?.avatar} />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        <VkLeftMenu />

        {/* Центральная колонка */}
        <div className='min-w-0 flex-1 space-y-3'>
          {/* Шапка */}
          <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
            <h1 className='mb-3 text-lg font-semibold text-[#e1e3e6]'>
              {initialQuery ? (
                <>
                  Результаты поиска
                  <span className='ml-2 text-sm font-normal text-[#828282]'>
                    &laquo;{initialQuery}&raquo;
                  </span>
                </>
              ) : (
                'Все пользователи'
              )}
            </h1>
            <div className='relative'>
              <FiSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#828282]' />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Уточнить поиск...'
                className='w-full rounded-lg border border-transparent bg-[#2a2a2b] py-2.5 pl-10 pr-4 text-sm text-[#e1e3e6] placeholder:text-[#828282] focus:border-[#2688eb] focus:outline-none'
              />
            </div>
          </div>

          {/* Результаты */}
          <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
            <p className='mb-2 px-1 text-sm text-[#828282]'>
              {filtered.length > 0
                ? `Найдено ${filtered.length} ${pluralUsers(filtered.length)}`
                : 'Никого не найдено'}
            </p>
            {filtered.length > 0 ? (
              <div className='space-y-1'>
                {filtered.map(user => (
                  <div key={user.id} className='flex items-center gap-3 rounded-lg p-2 hover:bg-[#2a2a2b]'>
                    <Link href={`${PATH.USERS}/${user.id}`} className='relative shrink-0'>
                      <VkAvatar name={user.name} src={user.avatar} size={56} />
                      {user.isOnline && (
                        <span className='absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[#222222] bg-[#4bb34b]' />
                      )}
                    </Link>
                    <div className='min-w-0 flex-1'>
                      <Link
                        href={`${PATH.USERS}/${user.id}`}
                        className='block truncate font-medium text-[#e1e3e6] hover:text-[#5b9bea]'
                      >
                        {user.name}
                      </Link>
                      <p className='truncate text-sm text-[#828282]'>
                        {user.isOnline ? 'Online' : user.city || user.email}
                      </p>
                      <div className='mt-1'>
                        <Link
                          href={`${PATH.CHAT}/${user.id}`}
                          className='inline-flex items-center gap-1.5 text-sm text-[#5b9bea] hover:underline'
                        >
                          <FiMessageCircle className='h-4 w-4' /> Написать сообщение
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-8 text-center'>
                <FiSearch className='mx-auto mb-2 h-8 w-8 text-[#828282]' />
                <p className='text-[#828282]'>Попробуйте изменить запрос</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function pluralUsers(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'пользователь'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'пользователя'
  return 'пользователей'
}
