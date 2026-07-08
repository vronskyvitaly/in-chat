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
        <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Email Address
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FaEnvelope className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='email'
            type='email'
            placeholder='name@example.com'
            disabled={isLoading} // Блокируем поле во время загрузки
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className='block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          />
        </div>
        {errors.email && <p className='text-sm text-red-600 dark:text-red-400'>{errors.email.message}</p>}
      </div>

      <div className='space-y-2'>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Password
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FaLock className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            disabled={isLoading} // Блокируем поле во время загрузки
            {...register('password', {
              required: 'Password is required'
            })}
            className='block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          />
          <button
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            disabled={isLoading}
            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {showPassword ? <ShowPasswordIcon /> : <ShowPasswordIcon isShow={false} />}
          </button>
        </div>
        {errors.password && (
          <p className='text-sm text-red-600 dark:text-red-400'>{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/30 dark:border-red-800'>
          <div className='flex items-start'>
            <svg
              className='h-5 w-5 text-red-500 mt-0.5'
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
            <p className='ml-2 text-sm text-red-600 dark:text-red-400'>{error}</p>
          </div>
        </div>
      )}

      <button
        type='submit'
        disabled={isLoading || !isValid || !isDirty}
        className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200'
      >
        {isLoading ? (
          <>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}
