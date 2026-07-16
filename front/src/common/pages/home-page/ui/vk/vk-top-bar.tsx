'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiSearch, FiBell } from 'react-icons/fi'
import { PATH } from '@/common/constants'
import { useMeQuery } from '@/features/auth/api'
import { useFetchUsersQuery } from '@/features/users/api'
import { VkAvatar } from './vk-avatar'
import { SkeletonCircle } from './vk-skeleton-primitives'

type Props = {
  name?: string | null
  avatar?: string | null
  isLoading?: boolean
}

const MAX_DROPDOWN = 5

export const VkTopBar = ({ name, avatar, isLoading }: Props) => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { data: me } = useMeQuery()
  const { data: users = [] } = useFetchUsersQuery()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return users.filter(
      u => u.id !== me?.id && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    )
  }, [users, query, me?.id])

  const showDropdown = focused && query.trim().length > 0

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showDropdown])

  const goToResults = () => {
    const q = query.trim()
    if (!q) return
    router.push(`${PATH.USERS}?q=${encodeURIComponent(q)}`)
    setFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      goToResults()
    }
  }

  return (
    <header className='sticky top-0 z-30 border-b border-[#2a2a2b] bg-[#19191a]/95 backdrop-blur'>
      <div className='mx-auto flex h-14 max-w-[1100px] items-center gap-2 px-2 sm:gap-4 sm:px-3'>
        {/* Логотип */}
        <Link href={PATH.HOME} className='flex shrink-0 items-center gap-2.5'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3d93ff] to-[#1a6ee0] shadow-sm'>
            <svg className='h-[18px] w-[18px] text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2.2}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.05-3.15A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
          </div>
          <span className='hidden text-lg font-bold tracking-tight text-[#e1e3e6] sm:block'>
            IN&nbsp;CHAT
          </span>
        </Link>

        {/* Поиск */}
        <div ref={wrapperRef} className='relative min-w-0 flex-1 sm:ml-2 sm:max-w-md'>
          <FiSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#828282]' />
          <input
            type='text'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder='Поиск'
            className='w-full rounded-lg border border-transparent bg-[#2a2a2b] py-2 pl-9 pr-3 text-sm text-[#e1e3e6] placeholder:text-[#828282] focus:border-[#2688eb] focus:bg-[#222] focus:outline-none'
          />

          {/* Дропдаун результатов */}
          {showDropdown && (
            <div className='absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-[#2a2a2b] bg-[#222222] shadow-xl'>
              {filtered.length > 0 ? (
                <>
                  <div className='max-h-[280px] overflow-y-auto py-1'>
                    {filtered.slice(0, MAX_DROPDOWN).map(user => (
                      <Link
                        key={user.id}
                        href={`${PATH.USERS}/${user.id}`}
                        onClick={() => setFocused(false)}
                        className='flex items-center gap-3 px-3 py-2 transition-colors hover:bg-[#2a2a2b]'
                      >
                        <div className='relative shrink-0'>
                          <VkAvatar name={user.name} src={user.avatar} size={36} />
                          {user.isOnline && (
                            <span className='absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#222222] bg-[#4bb34b]' />
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium text-[#e1e3e6]'>{user.name}</p>
                          <p className='truncate text-xs text-[#828282]'>{user.email}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={goToResults}
                    className='flex w-full items-center justify-center gap-2 border-t border-[#2a2a2b] px-3 py-2.5 text-sm text-[#5b9bea] transition-colors hover:bg-[#2a2a2b]'
                  >
                    <FiSearch className='h-3.5 w-3.5' />
                    Показать все результаты
                  </button>
                </>
              ) : (
                <div className='px-3 py-4 text-center text-sm text-[#828282]'>
                  Никого не найдено
                </div>
              )}
            </div>
          )}
        </div>

        {/* Уведомления + аватар */}
        <div className='ml-auto flex shrink-0 items-center gap-1'>
          <button
            className='flex h-9 w-9 items-center justify-center rounded-lg text-[#828282] transition-colors hover:bg-[#2a2a2b] hover:text-[#e1e3e6]'
            title='Уведомления'
          >
            <FiBell className='h-[20px] w-[20px]' />
          </button>
          <div className='ml-1'>
            {isLoading ? (
              <SkeletonCircle size={34} />
            ) : (
              <VkAvatar name={name} src={avatar} size={34} ring />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
