import { PATH } from '@/common/constants'
import Link from 'next/link'
import { SignOutButton } from '@/features/auth/ui'
import { useMeQuery } from '@/features/auth/api'

export const ActionsPanelBlockAuthenticatedActionsFragment = () => {
  useMeQuery()
  return (
    <>
      <Link
        href={PATH.POSTS}
        className='flex h-14 items-center justify-center gap-3 px-8 bg-gradient-to-r from-dark-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105'
      >
        Go to my posts
      </Link>
      <SignOutButton />
      <Link
        className='flex h-14 items-center justify-center gap-3 px-8 bg-gradient-to-r from-dark-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105'
        href={PATH.CHAT}
      >
        Go to chat
      </Link>
    </>
  )
}
