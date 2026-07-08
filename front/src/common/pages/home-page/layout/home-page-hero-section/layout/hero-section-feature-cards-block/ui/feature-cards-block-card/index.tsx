import { ReactNode } from 'react'

interface FeatureCardsBlockCardProps {
  icon: ReactNode
  title: string
  description: string
  gradientFrom?: string
  gradientTo?: string
}

export const FeatureCardsBlockCard = ({
  icon,
  title,
  description,
  gradientFrom = 'from-green-500',
  gradientTo = 'to-blue-500'
}: FeatureCardsBlockCardProps) => {
  return (
    <div className='text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20'>
      <div
        className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>{title}</h3>
      <p className='text-gray-600 dark:text-gray-300 text-sm'>{description}</p>
    </div>
  )
}
