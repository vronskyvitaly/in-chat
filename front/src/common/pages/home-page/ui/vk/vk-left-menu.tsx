'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import type { IconType } from 'react-icons'
import { FiUser, FiRss, FiMessageCircle, FiUsers, FiImage, FiHelpCircle, FiLogOut } from 'react-icons/fi'
import { PATH } from '@/common/constants'
import { useFetchUnreadCountsQuery } from '@/features/chat/api'
import { VkBottomNav } from './vk-bottom-nav'

type MenuItem = {
  label: string
  href: string
  icon: IconType
  badge?: number
}

export const VkLeftMenu = () => {
  const pathname = usePathname()
  const { data: unread } = useFetchUnreadCountsQuery()

  const MENU: MenuItem[] = [
    { label: 'Профиль', href: PATH.HOME, icon: FiUser },
    { label: 'Лента', href: PATH.POSTS, icon: FiRss },
    { label: 'Мессенджер', href: PATH.CHAT, icon: FiMessageCircle, badge: unread?.totalCount || undefined },
    { label: 'Друзья', href: PATH.FRIENDS, icon: FiUsers },
    { label: 'Фото', href: PATH.PHOTOS, icon: FiImage },
    { label: 'Помощь', href: PATH.HELP, icon: FiHelpCircle }
  ]

  return (
    <>
    {/* На < 640px навигация переезжает в нижнюю панель */}
    <VkBottomNav />

    <nav className='sticky top-[72px] hidden w-56 shrink-0 lg:block'>
      <ul className='space-y-0.5'>
        {MENU.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href
          return (
            <li key={label}>
              <Link
                href={href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] transition-colors ${
                  isActive
                    ? 'bg-[#2a2a2b] font-medium text-[#e1e3e6]'
                    : 'text-[#aeb0b3] hover:bg-[#232324] hover:text-[#e1e3e6]'
                }`}
              >
                <Icon className='h-[18px] w-[18px] text-[#828282] group-hover:text-[#5b9bea]' />
                <span>{label}</span>
                {badge ? (
                  <span className='ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2688eb] px-1.5 text-xs font-medium text-white'>
                    {badge}
                  </span>
                ) : null}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Выход из аккаунта */}
      <div className='mt-1 border-t border-[#2a2a2b] pt-1'>
        <button
          onClick={() => signOut({ callbackUrl: PATH.SING_IN })}
          className='group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-[#aeb0b3] transition-colors hover:bg-[#232324] hover:text-[#e1e3e6]'
        >
          <FiLogOut className='h-[18px] w-[18px] text-[#828282] group-hover:text-[#5b9bea]' />
          <span>Выйти</span>
        </button>
      </div>
    </nav>
    </>
  )
}
