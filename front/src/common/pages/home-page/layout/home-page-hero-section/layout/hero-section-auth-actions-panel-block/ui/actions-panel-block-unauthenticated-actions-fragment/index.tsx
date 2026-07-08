import { PATH } from '@/common/constants'
import Link from 'next/link'
import { GoogleSignInButton } from '@/features/auth/ui'

export const ActionsPanelBlockUnauthenticatedActionsFragment = () => {
  return (
    <>
      <GoogleSignInButton />
      <Link
        href={PATH.SING_IN}
        className='flex h-14 items-center justify-center gap-3 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
          />
        </svg>
        Sign In
      </Link>
      <Link
        href={PATH.SING_UP}
        className='flex h-14 items-center justify-center gap-3 px-8 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700 transition-all duration-200'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
          />
        </svg>
        Create Account
      </Link>
    </>
  )
}
