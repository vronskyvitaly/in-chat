'use client'
import { useState } from 'react'
import { PATH } from '@/common/constants'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GitHubSignInButton, GoogleSignInButton } from '@/features/auth/ui'
import { SignInForm, type TSignInFormValues } from '@/features/auth/ui'
import { AuthHeader, AuthNavigation } from '../layout'
import { AuthDecorativeElement, AuthSignInDivider } from '../ui'

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
    <main className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <AuthHeader
          title='Welcome Back'
          subtitle='Sign in to your account to continue'
          icon={
            <div className='inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'>
              <span className='text-2xl font-bold text-white'>💬</span>
            </div>
          }
        />

        {/* Social Login Buttons */}
        <div className='space-y-3 mb-6'>
          <GoogleSignInButton />
          <GitHubSignInButton />
        </div>

        {/* Divider */}
        <AuthSignInDivider />

        {/* SignIn Form */}
        <SignInForm onSubmit={onSubmit} error={error} isLoading={isLoading} />

        {/* Sign Up link */}
        <AuthNavigation title='Don`t have an account' href={PATH.SING_UP} titleNext={'Sign Up'} />

        {/* Decorative element */}
        <AuthDecorativeElement />
      </div>
    </main>
  )
}
