import { signIn } from 'next-auth/react'
import { GoogleIcon } from '@/common/assets/icons'

export const GoogleSignInButton = () => {
  return (
    <button
      onClick={() => signIn('google')}
      className='flex h-14 w-full items-center justify-center gap-3 px-8 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700 transition-all duration-200 cursor-pointer'
    >
      <GoogleIcon />
      Sign in with Google
    </button>
  )
}
