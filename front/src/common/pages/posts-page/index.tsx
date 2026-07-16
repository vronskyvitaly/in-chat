'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMeQuery } from '@/features/auth/api'
import { useFetchAllPostsQuery } from '@/features/posts/api'
import {
  VkTopBar,
  VkLeftMenu,
  VkPostsFeed,
  VkCreatePostModal,
  VkPageSkeleton
} from '@/common/pages/home-page/ui/vk'

const FEED_FILTERS = ['Лента', 'Фотографии', 'Друзья', 'Поиск', 'Реакции']

export default function PostsPage() {
  const { data: session, status } = useSession()
  const isAuthenticated = !!session
  const [isCreatePostOpen, setCreatePostOpen] = useState(false)

  const { data: me } = useMeQuery(undefined, { skip: !isAuthenticated })
  const { data: posts = [], isLoading } = useFetchAllPostsQuery(undefined, { skip: !isAuthenticated })

  if (status === 'loading' || isLoading) {
    return <VkPageSkeleton variant='feed' />
  }

  const name = me?.name ?? session?.user?.name ?? 'Гость'
  const avatar = me?.avatar ?? session?.user?.image ?? null

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar name={name} avatar={avatar} />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        {/* Левое меню */}
        <VkLeftMenu />

        {/* Центральная колонка: лента */}
        <div className='min-w-0 flex-1 space-y-3'>
          <VkPostsFeed
            posts={posts}
            authorName={name}
            authorAvatar={avatar}
            isAuthenticated={isAuthenticated}
            onCreatePost={() => setCreatePostOpen(true)}
            feedTitle='Новости'
            showArchive={false}
            emptyText='В ленте пока нет записей'
          />
        </div>

        {/* Правая колонка: фильтры ленты */}
        <aside className='sticky top-[72px] hidden w-[280px] shrink-0 self-start xl:block'>
          <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-2'>
            <ul>
              {FEED_FILTERS.map((filter, i) => (
                <li key={filter}>
                  <button
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      i === 0
                        ? 'bg-[#2f2f30] font-medium text-[#e1e3e6]'
                        : 'text-[#aeb0b3] hover:bg-[#232324] hover:text-[#e1e3e6]'
                    }`}
                  >
                    {filter}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Модалка создания поста */}
      <VkCreatePostModal
        open={isCreatePostOpen}
        onClose={() => setCreatePostOpen(false)}
        authorName={name}
        authorAvatar={avatar}
      />
    </main>
  )
}
