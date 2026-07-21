import Link from 'next/link'
import { PATH } from '@/common/constants'
import { HomeIcon } from '@/common/assets/icons'
import { VkAvatar } from '@/common/pages/home-page/ui/vk/vk-avatar'

type Props = {
  userName?: string | null
  userAvatar?: string | null
}

export const SidebarHeader = ({ userName, userAvatar }: Props) => {
  return (
    <header className='flex items-center justify-between gap-3 border-b border-[#2a2a2b] px-4 py-4'>
      {/* Мобильный вид: аватар + название раздела, как в списке диалогов */}
      <div className='flex items-center gap-3 sm:hidden'>
        <Link href={PATH.HOME} title='На главную'>
          <VkAvatar name={userName} src={userAvatar} size={36} />
        </Link>
        <h2 className='text-[22px] font-bold tracking-tight text-[#e1e3e6]'>Мессенджер</h2>
      </div>

      {/* Десктоп: логотип и ссылка на главную */}
      <div className='hidden items-center gap-2.5 sm:flex'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3d93ff] to-[#1a6ee0] text-white shadow-sm'>
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2.2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.05-3.15A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </div>
        <h2 className='text-xl font-bold tracking-tight text-[#e1e3e6]'>IN&nbsp;CHAT</h2>
      </div>

      <Link
        href={PATH.HOME}
        title='На главную'
        className='hidden items-center gap-1.5 rounded-lg bg-[#2f2f30] px-3 py-1.5 text-sm font-medium text-[#aeb0b3] transition-all hover:bg-[#3a3a3b] hover:text-[#e1e3e6] sm:flex'
      >
        <HomeIcon />
        <span>Главная</span>
      </Link>
    </header>
  )
}
