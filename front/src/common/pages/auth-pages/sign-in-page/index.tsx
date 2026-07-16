'use client'
import { useState } from 'react'
import { PATH } from '@/common/constants'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GitHubSignInButton, GoogleSignInButton } from '@/features/auth/ui'
import { SignInForm, type TSignInFormValues } from '@/features/auth/ui'
import { AuthHeader, AuthNavigation } from '../layout'
import { AuthDecorativeElement, AuthSignInDivider, AuthLogo } from '../ui'

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isLoading = loading

  const onSubmit = async (data: TSignInFormValues) => {
    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push(PATH.HOME)
      }
    } catch (error) {
      setError('An error occurred during login')
      console.log(
        'Error occurred during login [src/common/pages/sign-in-page/index.tsx], more details in the logs',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#19191a] px-4 py-12'>
      {/* Мягкое свечение на фоне */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute left-1/2 top-[-10%] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[#2688eb]/10 blur-[140px]' />
      </div>

      <div className='relative w-full max-w-md'>
        <div className='rounded-2xl border border-[#2a2a2b] bg-[#222222] p-8 shadow-2xl'>
          {/* Header */}
          <AuthHeader
            title='С возвращением'
            subtitle='Войдите в аккаунт, чтобы продолжить'
            icon={<AuthLogo />}
          />

          {/* Social Login Buttons */}
          <div className='mb-6 space-y-3'>
            <GoogleSignInButton />
            <GitHubSignInButton />
          </div>

          {/* Divider */}
          <AuthSignInDivider />

          {/* SignIn Form */}
          <SignInForm onSubmit={onSubmit} error={error} isLoading={isLoading} />

          {/* Sign Up link */}
          <AuthNavigation title='Ещё нет аккаунта' href={PATH.SING_UP} titleNext='Зарегистрироваться' />
        </div>

        {/* Decorative element */}
        <AuthDecorativeElement />
      </div>
    </main>
  )
}
