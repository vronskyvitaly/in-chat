import type { ReactNode } from 'react'
import { VkTopBar } from './vk-top-bar'
import { VkLeftMenu } from './vk-left-menu'
import { VkProfileHeader } from './vk-profile-header'
import { VkPhotos } from './vk-photos'
import { VkPostsFeed } from './vk-posts-feed'
import { VkRightColumn } from './vk-right-column'
import { SkeletonLine, SkeletonCircle, SkeletonCard, SkeletonUserRow } from './vk-skeleton-primitives'

export { SkeletonLine, SkeletonCircle, SkeletonCard, SkeletonUserRow }

type Variant = 'profile' | 'feed' | 'friends' | 'photos' | 'settings' | 'search'

/* ─── Варианты центральной колонки ─── */

const ProfileCenterSkeleton = () => (
  <div className='space-y-3'>
    <VkProfileHeader isLoading />

    <div className='flex items-start gap-4'>
      <div className='min-w-0 flex-1 space-y-3'>
        <VkPhotos isLoading photos={[]} />
        <VkPostsFeed isLoading />
      </div>
      <VkRightColumn isLoading friends={[]} />
    </div>
  </div>
)

const FeedCenterSkeleton = () => (
  <VkPostsFeed isLoading />
)

const FriendsSkeleton = () => (
  <div className='space-y-3'>
    {/* Поиск */}
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3 space-y-3'>
      <div className='flex items-center gap-2'>
        <SkeletonLine className='h-8 w-32 rounded-lg' />
        <SkeletonLine className='h-3 w-16' />
      </div>
      <SkeletonLine className='h-10 w-full rounded-lg' />
    </div>
    {/* Список */}
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3 space-y-1'>
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonUserRow key={i} />
      ))}
    </div>
  </div>
)

const FeedRightSkeleton = () => (
  <aside className='sticky top-[72px] hidden w-[280px] shrink-0 self-start xl:block'>
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-2 space-y-1'>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonLine key={i} className='h-9 w-full rounded-lg' />
      ))}
    </div>
  </aside>
)

const FriendsRightSkeleton = () => (
  <aside className='sticky top-[72px] hidden max-h-[calc(100vh-88px)] w-[280px] shrink-0 space-y-3 self-start overflow-y-auto xl:block'>
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-2 space-y-1'>
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonLine key={i} className='h-9 w-full rounded-lg' />
      ))}
    </div>
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4 space-y-3'>
      <SkeletonLine className='h-4 w-32' />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className='flex items-center gap-3'>
          <SkeletonCircle size={40} />
          <div className='flex-1 space-y-1.5'>
            <SkeletonLine className='h-3 w-2/3' />
            <SkeletonLine className='h-2.5 w-1/2' />
          </div>
        </div>
      ))}
    </div>
  </aside>
)

const PhotosSkeleton = () => (
  <div className='space-y-3'>
    {/* Шапка */}
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <SkeletonCircle size={20} />
          <SkeletonLine className='h-5 w-40' />
        </div>
        <SkeletonLine className='h-9 w-32 rounded-lg' />
      </div>
    </div>
    {/* Год + сетка */}
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4 space-y-3'>
      <SkeletonLine className='h-4 w-20' />
      <div className='grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6'>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonLine key={i} className='aspect-square w-full rounded-lg' />
        ))}
      </div>
    </div>
  </div>
)

const SettingsSkeleton = () => (
  <div className='space-y-3'>
    {/* Шапка профиля */}
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] overflow-hidden'>
      <SkeletonLine className='h-32 w-full rounded-none' />
      <div className='flex items-end gap-4 px-4 pb-4'>
        <div className='-mt-10 rounded-full border-4 border-[#222222]'>
          <SkeletonCircle size={88} />
        </div>
        <div className='flex-1 space-y-2 pb-1'>
          <SkeletonLine className='h-5 w-1/3' />
          <SkeletonLine className='h-3 w-1/4' />
        </div>
      </div>
    </div>
    {/* Форма */}
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-6 space-y-5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='grid gap-1.5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-4'>
          <SkeletonLine className='h-3 w-24 sm:ml-auto' />
          <SkeletonLine className='h-10 w-full rounded-lg' />
        </div>
      ))}
      <div className='flex items-center justify-center gap-3 pt-2'>
        <SkeletonLine className='h-10 w-32 rounded-lg' />
        <SkeletonLine className='h-10 w-24 rounded-lg' />
      </div>
    </div>
  </div>
)

const SettingsRightSkeleton = () => (
  <aside className='hidden w-[280px] shrink-0 xl:block'>
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-2 space-y-1'>
      <div className='px-3 py-2 space-y-1.5'>
        <SkeletonLine className='h-4 w-28' />
        <SkeletonLine className='h-2.5 w-full' />
      </div>
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonLine key={i} className='h-9 w-full rounded-lg' />
      ))}
    </div>
  </aside>
)

const SearchSkeleton = () => (
  <div className='space-y-3'>
    {/* Шапка */}
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4 space-y-3'>
      <SkeletonLine className='h-5 w-40' />
      <SkeletonLine className='h-10 w-full rounded-lg' />
    </div>
    {/* Результаты */}
    <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3 space-y-1'>
      <SkeletonLine className='h-3 w-28 mb-2 mx-1' />
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonUserRow key={i} />
      ))}
    </div>
  </div>
)

/* ─── Основной компонент ─── */

const centerContent: Record<Variant, () => ReactNode> = {
  profile: ProfileCenterSkeleton,
  feed: FeedCenterSkeleton,
  friends: FriendsSkeleton,
  photos: PhotosSkeleton,
  settings: SettingsSkeleton,
  search: SearchSkeleton,
}

const rightContent: Record<Variant, (() => ReactNode) | null> = {
  // profile: правая колонка рендерится внутри ProfileCenterSkeleton — под шапкой профиля
  profile: null,
  feed: FeedRightSkeleton,
  friends: FriendsRightSkeleton,
  photos: null,
  settings: SettingsRightSkeleton,
  search: null,
}

export const VkPageSkeleton = ({ variant }: { variant: Variant }) => {
  const Center = centerContent[variant]
  const Right = rightContent[variant]

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar isLoading />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        <VkLeftMenu />

        <div className='min-w-0 flex-1'>
          <Center />
        </div>

        {Right && <Right />}
      </div>
    </main>
  )
}
