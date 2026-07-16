import { signIn } from 'next-auth/react'
import { GoogleIcon } from '@/common/assets/icons'

export const GoogleSignInButton = () => {
  return (
    <button
      onClick={() => signIn('google')}
      className='flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#3a3a3b] bg-[#2a2a2b] px-6 font-medium text-[#e1e3e6] transition-colors hover:border-[#4a4a4b] hover:bg-[#2f2f30] focus:outline-none'
    >
      <GoogleIcon />
      Войти через Google
    </button>
  )
}
