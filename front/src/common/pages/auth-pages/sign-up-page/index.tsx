'use client'
import { useEffect, useState } from 'react'
import { PATH } from '@/common/constants'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import { useSignUpMutation } from '@/features/auth/api'
import Link from 'next/link'
import { SignUpForm, type TSignUpFormValues } from '@/features/auth/ui'
import { AuthHeader, AuthNavigation } from '../layout'
import { AuthDecorativeElement, AuthLogo } from '../ui'

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
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#19191a] px-4 py-12'>
      {/* Мягкое свечение на фоне */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute left-1/2 top-[-10%] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[#2688eb]/10 blur-[140px]' />
      </div>

      <div className='relative w-full max-w-md'>
        <div className='rounded-2xl border border-[#2a2a2b] bg-[#222222] p-8 shadow-2xl'>
          {/* Header */}
          <AuthHeader
            title='Создать аккаунт'
            subtitle='Присоединяйтесь, чтобы начать общение'
            icon={<AuthLogo />}
          />

          {/* Back Link */}
          <Link
            href={PATH.SING_IN}
            className='mb-6 flex items-center gap-2 text-[#828282] transition-colors hover:text-[#e1e3e6]'
          >
            <FaArrowLeft className='h-4 w-4' />
            <span className='text-sm font-medium'>Назад ко входу</span>
          </Link>

          {/* Registration Form */}
          <SignUpForm onSubmit={onSubmit} error={error} isLoading={isLoading} />

          {/* Sign in link */}
          <AuthNavigation title='Уже есть аккаунт' href={PATH.SING_IN} titleNext='Войти' />
        </div>

        {/* Decorative Element */}
        <AuthDecorativeElement />
      </div>
    </main>
  )
}

export default SignUpPage
