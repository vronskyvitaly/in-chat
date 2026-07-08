import Link from 'next/link'
import { PATH } from '@/common/constants'
import { HomeIcon } from '@/common/assets/icons'

export const SidebarHeader = () => {
  return (
    <header className='flex items-center justify-between gap-3 border-b border-gray-200/70 bg-white/60 px-4 py-4 backdrop-blur-sm'>
      <div className='flex items-center gap-2.5'>
        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-sm'>
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.84L3 20l1.05-3.15A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg>
        </div>
        <h2 className='text-xl font-bold tracking-tight text-gray-800'>Chat</h2>
      </div>

      <Link
        href={PATH.HOME}
        title='На главную'
        className='flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
      >
        <HomeIcon />
        <span className='hidden sm:inline'>Главная</span>
      </Link>
    </header>
  )
}
