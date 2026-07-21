'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { IconType } from 'react-icons'
import { FiUser, FiRss, FiMessageCircle, FiUsers, FiMenu, FiImage, FiHelpCircle, FiLogOut } from 'react-icons/fi'
import { PATH } from '@/common/constants'
import { useFetchUnreadCountsQuery } from '@/features/chat/api'

type NavItem = {
  label: string
  href: string
  icon: IconType
  badge?: number
}

/**
 * Нижняя панель навигации для мобильного (< 640px).
 * Дублирует VkLeftMenu, который на этой ширине скрыт:
 * четыре основных раздела + шторка «Ещё» с остальными.
 */
export const VkBottomNav = () => {
  const pathname = usePathname()
  const { data: unread } = useFetchUnreadCountsQuery()
  const [isMoreOpen, setMoreOpen] = useState(false)

  // Блокируем скролл страницы, пока открыта шторка
  useEffect(() => {
    if (isMoreOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMoreOpen])

  useEffect(() => {
    if (!isMoreOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMoreOpen])

  const MAIN: NavItem[] = [
    { label: 'Профиль', href: PATH.HOME, icon: FiUser },
    { label: 'Лента', href: PATH.POSTS, icon: FiRss },
    { label: 'Сообщения', href: PATH.CHAT, icon: FiMessageCircle, badge: unread?.totalCount || undefined },
    { label: 'Друзья', href: PATH.FRIENDS, icon: FiUsers }
  ]

  const MORE: NavItem[] = [
    { label: 'Фото', href: PATH.PHOTOS, icon: FiImage },
    { label: 'Помощь', href: PATH.HELP, icon: FiHelpCircle }
  ]

  // «Ещё» подсвечивается, когда открыт один из спрятанных в шторке разделов
  const isMoreActive = MORE.some(item => pathname === item.href)

  return (
    <>
      <nav
        data-bottom-nav
        className='fixed inset-x-0 bottom-0 z-40 border-t border-[#2a2a2b] bg-[#19191a]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden'
      >
        <ul className='flex h-14 items-stretch'>
          {MAIN.map(({ label, href, icon: Icon, badge }) => {
            const isActive = pathname === href
            return (
              <li key={label} className='flex-1'>
                <Link
                  href={href}
                  className={`flex h-full flex-col items-center justify-center gap-0.5 transition-colors ${
                    isActive ? 'text-[#e1e3e6]' : 'text-[#828282]'
                  }`}
                >
                  <span className='relative'>
                    <Icon className='h-[22px] w-[22px]' />
                    {badge ? (
                      <span className='absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2688eb] px-1 text-[10px] font-medium text-white'>
                        {badge > 99 ? '99+' : badge}
                      </span>
                    ) : null}
                  </span>
                  <span className='text-[10px] leading-none'>{label}</span>
                </Link>
              </li>
            )
          })}

          <li className='flex-1'>
            <button
              onClick={() => setMoreOpen(true)}
              aria-label='Ещё'
              aria-expanded={isMoreOpen}
              className={`flex h-full w-full flex-col items-center justify-center gap-0.5 transition-colors ${
                isMoreActive || isMoreOpen ? 'text-[#e1e3e6]' : 'text-[#828282]'
              }`}
            >
              <FiMenu className='h-[22px] w-[22px]' />
              <span className='text-[10px] leading-none'>Ещё</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Шторка «Ещё» */}
      {isMoreOpen && (
        <div
          className='fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm sm:hidden'
          onMouseDown={() => setMoreOpen(false)}
        >
          <div
            className='w-full rounded-t-2xl border-t border-[#2a2a2b] bg-[#222222] pb-[env(safe-area-inset-bottom)]'
            onMouseDown={e => e.stopPropagation()}
          >
            <div className='flex justify-center py-3'>
              <span className='h-1 w-10 rounded-full bg-[#3a3a3b]' />
            </div>

            <ul className='px-2 pb-2'>
              {MORE.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] transition-colors ${
                        isActive ? 'bg-[#2a2a2b] font-medium text-[#e1e3e6]' : 'text-[#aeb0b3]'
                      }`}
                    >
                      <Icon className='h-[20px] w-[20px] text-[#828282]' />
                      {label}
                    </Link>
                  </li>
                )
              })}

              <li className='mt-1 border-t border-[#2a2a2b] pt-1'>
                <button
                  onClick={() => {
                    setMoreOpen(false)
                    signOut({ callbackUrl: PATH.SING_IN })
                  }}
                  className='flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-[#aeb0b3] transition-colors'
                >
                  <FiLogOut className='h-[20px] w-[20px] text-[#828282]' />
                  Выйти
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
