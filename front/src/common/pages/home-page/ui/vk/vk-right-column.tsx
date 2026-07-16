'use client'
import Link from 'next/link'
import type { TUser } from '@/features/users/types'
import { PATH } from '@/common/constants'
import { VkAvatar } from './vk-avatar'
import { SkeletonLine, SkeletonCircle } from './vk-skeleton-primitives'

type Props = {
  friends: TUser[]
  isLoading?: boolean
}

export const VkRightColumn = ({ friends, isLoading }: Props) => {
  const online = friends.filter(f => f.isOnline)
  const onlinePreview = online.slice(0, 4)
  const friendsPreview = friends.slice(0, 4)

  if (isLoading) {
    return (
      <aside className='sticky top-[72px] hidden max-h-[calc(100vh-88px)] w-[260px] shrink-0 space-y-3 self-start overflow-y-auto xl:block'>
        {/* Друзья онлайн — скелетон */}
        <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
          <div className='mb-3 flex items-baseline gap-2'>
            <SkeletonLine className='h-4 w-24' />
            <SkeletonLine className='h-3 w-6' />
          </div>
          <div className='grid grid-cols-4 gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='text-center'>
                <SkeletonCircle size={52} />
                <SkeletonLine className='mx-auto mt-1 h-2.5 w-10' />
              </div>
            ))}
          </div>
        </div>

        {/* Друзья — скелетон */}
        <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
          <div className='mb-3 flex items-baseline gap-2'>
            <SkeletonLine className='h-4 w-24' />
            <SkeletonLine className='h-3 w-6' />
          </div>
          <div className='grid grid-cols-4 gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='text-center'>
                <SkeletonCircle size={52} />
                <SkeletonLine className='mx-auto mt-1 h-2.5 w-10' />
              </div>
            ))}
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className='sticky top-[72px] hidden max-h-[calc(100vh-88px)] w-[260px] shrink-0 space-y-3 self-start overflow-y-auto xl:block'>
      {/* Друзья онлайн */}
      <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
        <div className='mb-3 flex items-baseline gap-2'>
          <span className='font-medium text-[#e1e3e6]'>Друзья онлайн</span>
          <span className='text-sm text-[#828282]'>{online.length}</span>
        </div>
        {onlinePreview.length > 0 ? (
          <div className='grid grid-cols-4 gap-2'>
            {onlinePreview.map(f => (
              <Link key={f.id} href={`${PATH.CHAT}/${f.id}`} className='group text-center'>
                <div className='relative mx-auto w-fit'>
                  <VkAvatar name={f.name} src={f.avatar} size={52} />
                  <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#222222] bg-[#4bb34b]' />
                </div>
                <p className='mt-1 truncate text-xs text-[#aeb0b3] group-hover:text-[#5b9bea]'>
                  {f.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className='text-sm text-[#828282]'>Никого нет в сети</p>
        )}
      </div>

      {/* Друзья */}
      <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
        <div className='mb-3 flex items-baseline gap-2'>
          <span className='font-medium text-[#e1e3e6]'>Друзья</span>
          <span className='text-sm text-[#828282]'>{friends.length}</span>
        </div>
        {friendsPreview.length > 0 ? (
          <div className='grid grid-cols-4 gap-2'>
            {friendsPreview.map(f => (
              <Link key={f.id} href={`${PATH.CHAT}/${f.id}`} className='group text-center'>
                <VkAvatar name={f.name} src={f.avatar} size={52} className='mx-auto' />
                <p className='mt-1 truncate text-xs text-[#aeb0b3] group-hover:text-[#5b9bea]'>
                  {f.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className='text-sm text-[#828282]'>Список друзей пуст</p>
        )}
      </div>
    </aside>
  )
}
