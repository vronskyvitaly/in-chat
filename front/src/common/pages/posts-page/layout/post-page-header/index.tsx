'use client'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { HeaderSubtitle, HeaderTitle } from './ui'
import { HomeIcon } from '@/common/assets/icons'

type Props = {
  session: Session | null
}

export const PostPageHeader = ({ session }: Props) => {
  const router = useRouter()

  return (
    <header className='flex items-center justify-between mb-8'>
      <div>
        <HeaderTitle />
        <HeaderSubtitle />
      </div>
      <div className='flex items-center gap-4'>
        {/*{todo: 501}*/}
        <button
          onClick={() => router.push('/')}
          className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer'
        >
          <HomeIcon />
          <span className='text-sm font-medium'>Home</span>
        </button>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
            <span className='text-white text-sm font-medium'>
              {(session?.user?.name || session?.user?.email || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className='text-sm text-gray-600 dark:text-gray-400'>{session?.user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  )
}
