import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'

export const GitHubSignInButton = () => {
  return (
    <button
      type='button'
      onClick={() => signIn('github')}
      // Временно отключено
      disabled
      title='Временно недоступно'
      className='flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#3a3a3b] bg-[#2a2a2b] px-6 font-medium text-[#e1e3e6] transition-colors hover:border-[#4a4a4b] hover:bg-[#2f2f30] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#3a3a3b] disabled:hover:bg-[#2a2a2b]'
    >
      <FaGithub className='h-5 w-5' />
      Продолжить с GitHub
    </button>
  )
}
