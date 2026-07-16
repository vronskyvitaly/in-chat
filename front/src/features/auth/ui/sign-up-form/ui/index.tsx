'use client'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'
import { useState } from 'react'
import { ShowPasswordIcon } from '@/common/assets/icons'
import { type TSignUpFormValues, useSignUpForm } from '@/features/auth/ui'

type Props = {
  onSubmit(data: TSignUpFormValues): void
  error: string | null
  isLoading: boolean
}

export const SignUpForm = ({ onSubmit, error, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useSignUpForm()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev)
  }

  return (
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-2'>
        <label htmlFor='name' className='block text-sm font-medium text-[#aeb0b3]'>
          Имя
        </label>
        <div className='relative'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <FaUser className='h-4 w-4 text-[#828282]' />
          </div>
          <input
            id='name'
            type='text'
            placeholder='Иван Иванов'
            disabled={isLoading}
            {...register('name')}
            className='block w-full rounded-xl border border-[#3a3a3b] bg-[#2a2a2b] py-3 pl-10 pr-4 text-[#e1e3e6] placeholder-[#828282] transition-colors focus:border-[#2688eb] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          />
        </div>
        {errors.name && <p className='text-sm text-red-400'>{errors.name.message}</p>}
      </div>

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
            disabled={isLoading}
            {...register('email')}
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
            disabled={isLoading}
            {...register('password')}
            className='block w-full rounded-xl border border-[#3a3a3b] bg-[#2a2a2b] py-3 pl-10 pr-12 text-[#e1e3e6] placeholder-[#828282] transition-colors focus:border-[#2688eb] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
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

      <div className='space-y-2'>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-[#aeb0b3]'
        >
          Подтвердите пароль
        </label>
        <div className='relative'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <FaLock className='h-4 w-4 text-[#828282]' />
          </div>
          <input
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='••••••••'
            disabled={isLoading}
            {...register('confirmPassword')}
            className='block w-full rounded-xl border border-[#3a3a3b] bg-[#2a2a2b] py-3 pl-10 pr-12 text-[#e1e3e6] placeholder-[#828282] transition-colors focus:border-[#2688eb] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          />
          <button
            type='button'
            onClick={toggleConfirmPasswordVisibility}
            disabled={isLoading}
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-[#828282] transition-colors hover:text-[#e1e3e6] disabled:cursor-not-allowed disabled:opacity-50'
          >
            {showConfirmPassword ? <ShowPasswordIcon /> : <ShowPasswordIcon isShow={false} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='text-sm text-red-400'>{errors.confirmPassword.message}</p>
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
            Создание аккаунта…
          </>
        ) : (
          'Создать аккаунт'
        )}
      </button>
    </form>
  )
}
