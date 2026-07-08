import { HeartIcon, LightningIcon, LockIcon } from '@/common/assets/icons'
import { FeatureCardsBlockCard } from './ui'

export const HeroSectionFeatureCardsBlock = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto'>
      <FeatureCardsBlockCard
        icon={<LightningIcon />}
        title={'Lightning Fast'}
        description={' Real-time messaging with WebSocket technology for instant delivery.'}
      />

      <FeatureCardsBlockCard
        icon={<LockIcon />}
        title={'Secure'}
        description={'End-to-end encryption and secure authentication for peace of mind.'}
        gradientFrom={'from-blue-500'}
        gradientTo={'to-purple-500'}
      />

      <FeatureCardsBlockCard
        icon={<HeartIcon />}
        title={'User Friendly'}
        description={'Beautiful interface designed for easy and enjoyable conversations.'}
        gradientFrom={'from-purple-500'}
        gradientTo={'to-pink-500'}
      />
    </div>
  )
}
