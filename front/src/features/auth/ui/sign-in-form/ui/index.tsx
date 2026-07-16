'use client'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { useState } from 'react'
import { ShowPasswordIcon } from '@/common/assets/icons'
import { type TSignInFormValues, useSignInForm } from '@/features/auth/ui'

type Props = {
  onSubmit(data: TSignInFormValues): void
  error: string | null
  isLoading: boolean
}

export const SignInForm = ({ onSubmit, error, isLoading: externalIsLoading }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid, isDirty }
  } = useSignInForm()

  const [showPassword, setShowPassword] = useState(false)

  const isLoading = externalIsLoading || isSubmitting

  return (
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-2'>
        <label htmlFor='email' className='block text-sm font-medium text-[#aeb0b3]'>
          Электронная почта
        </label>
        <div className='relative'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <FaEnvelope className='h-4 w-4 text-[#828282]' />
          </div>
          <input
            id='email'
            type='email'
            placeholder='name@example.com'
            disabled={isLoading} // Блокируем поле во время загрузки
            {...register('email', {
              required: 'Укажите электронную почту',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Некорректный адрес почты'
              }
            })}
            className='block w-full rounded-xl border border-[#3a3a3b] bg-[#2a2a2b] py-3 pl-10 pr-4 text-[#e1e3e6] placeholder-[#828282] transition-colors focus:border-[#2688eb] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          />
        </div>
        {errors.email && <p className='text-sm text-red-400'>{errors.email.message}</p>}
      </div>

      <div className='space-y-2'>
        <label htmlFor='password' className='block text-sm font-medium text-[#aeb0b3]'>
          Пароль
        </label>
        <div className='relative'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <FaLock className='h-4 w-4 text-[#828282]' />
          </div>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            disabled={isLoading} // Блокируем поле во время загрузки
            {...register('password', {
              required: 'Укажите пароль'
            })}
            className='block w-full rounded-xl border border-[#3a3a3b] bg-[#2a2a2b] py-3 pl-10 pr-12 text-[#e1e3e6] placeholder-[#828282] transition-colors focus:border-[#2688eb] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          />
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            disabled={isLoading}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-[#828282] transition-colors hover:text-[#e1e3e6] disabled:cursor-not-allowed disabled:opacity-50'
          >
            {showPassword ? <ShowPasswordIcon /> : <ShowPasswordIcon isShow={false} />}
          </button>
        </div>
        {errors.password && (
          <p className='text-sm text-red-400'>{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className='rounded-xl border border-red-900/60 bg-red-950/40 p-3'>
          <div className='flex items-start'>
            <svg
              className='mt-0.5 h-5 w-5 text-red-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <p className='ml-2 text-sm text-red-400'>{error}</p>
          </div>
        </div>
      )}

      <button
        type='submit'
        disabled={isLoading || !isValid || !isDirty}
        className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#2688eb] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2076d1] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
      >
        {isLoading ? (
          <>
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
            Вход…
          </>
        ) : (
          'Войти'
        )}
      </button>
    </form>
  )
}
