import { ReactElement } from 'react'

type Props = {
  title: string
  subtitle: string
  icon: ReactElement
}

export const AuthHeader = ({ title, subtitle, icon }: Props) => {
  return (
    <div className='mb-8 text-center'>
      {icon}
      <h1 className='mb-2 text-2xl font-bold text-[#e1e3e6]'>{title}</h1>
      <p className='text-sm text-[#828282]'>{subtitle}</p>
    </div>
  )
}
