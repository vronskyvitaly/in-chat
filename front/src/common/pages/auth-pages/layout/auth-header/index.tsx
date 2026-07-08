import { ReactElement } from 'react'

type Props = {
  title: string
  subtitle: string
  icon: ReactElement
}

export const AuthHeader = ({ title, subtitle, icon }: Props) => {
  return (
    <div className='text-center mb-8'>
      {icon}
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>{title}</h1>
      <p className='text-gray-600 dark:text-gray-400'>{subtitle}</p>
    </div>
  )
}
