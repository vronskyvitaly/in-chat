'use client'
import { useEffect, useState } from 'react'
import { PATH } from '@/common/constants'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaUser } from 'react-icons/fa'
import { useSignUpMutation } from '@/features/auth/api'
import Link from 'next/link'
import { SignUpForm, type TSignUpFormValues } from '@/features/auth/ui'
import { AuthHeader, AuthNavigation } from '../layout'
import { AuthDecorativeElement } from '../ui'

const SignUpPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [signUpMutation] = useSignUpMutation()
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const onSubmit = async (data: TSignUpFormValues) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    setError(null)
    setIsLoading(true)

    try {
      await signUpMutation(data).unwrap()
      router.push(PATH.SING_IN)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = err as { data: { message?: string } }
        const errorMessage =
          errorData.data.message === 'A user with this email is already registered'
            ? errorData.data.message
            : 'Registration error'
        setError(errorMessage)

        // Устанавливаем новый таймаут и сохраняем его ID
        const id = setTimeout(() => {
          setError(null)
          setTimeoutId(null)
        }, 4000)

        setTimeoutId(id)
      } else {
        setError('Registration error')
        const id = setTimeout(() => {
          setError(null)
          setTimeoutId(null)
        }, 4000)

        setTimeoutId(id)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <AuthHeader
          title='Create Account'
          subtitle='Join us to start chatting with friends'
          icon={
            <div className='inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full'>
              <FaUser className='w-8 h-8 text-white' />
            </div>
          }
        />

        {/* Back Link */}
        <Link
          href={PATH.SING_IN}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors'
        >
          <FaArrowLeft className='w-4 h-4' />
          <span className='text-sm font-medium'>Back to Sign In</span>
        </Link>

        {/* Registration Form */}
        <SignUpForm onSubmit={onSubmit} error={error} isLoading={isLoading} />

        {/* Sign in link */}
        <AuthNavigation title='Already have an account' href={PATH.SING_IN} titleNext={'Sign In'} />

        {/* Decorative Element */}
        <AuthDecorativeElement />
      </div>
    </main>
  )
}

export default SignUpPage
