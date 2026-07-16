'use client'
import Link from 'next/link'
import type { TPost } from '@/features/posts/types'
import { PATH } from '@/common/constants'
import { VkAvatar } from './vk-avatar'
import { VkPostCard } from './vk-post-card'
import { SkeletonCircle, SkeletonLine, SkeletonCard } from './vk-skeleton-primitives'

type Props = {
  posts?: TPost[]
  authorName?: string
  authorAvatar?: string | null
  isAuthenticated?: boolean
  onCreatePost?: () => void
  /** Заголовок ленты: «Мои посты» в профиле, «Новости» в общей ленте */
  feedTitle?: string
  /** Показывать ссылку «Архив постов» (только в профиле) */
  showArchive?: boolean
  /** Текст, когда постов нет */
  emptyText?: string
  isLoading?: boolean
}

export const VkPostsFeed = ({
  posts = [],
  authorName = '',
  authorAvatar,
  isAuthenticated = false,
  onCreatePost,
  feedTitle = 'Мои посты',
  showArchive = true,
  emptyText = 'Записей пока нет',
  isLoading
}: Props) => {
  if (isLoading) {
    return (
      <section className='space-y-3'>
        {/* Создание поста — скелетон */}
        <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
          <div className='flex items-center gap-3'>
            <SkeletonCircle size={40} />
            <SkeletonLine className='h-10 flex-1 rounded-full' />
          </div>
        </div>
        <SkeletonCard />
        <SkeletonCard />
      </section>
    )
  }

  return (
    <section className='space-y-3'>
      {/* Создать пост */}
      <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
        <div className='flex items-center gap-3'>
          <VkAvatar name={authorName} src={authorAvatar} size={40} />
          <button
            onClick={onCreatePost}
            className='flex-1 rounded-full bg-[#2a2a2b] px-4 py-2.5 text-left text-sm text-[#828282] transition-colors hover:bg-[#2f2f30]'
          >
            Что у вас нового?
          </button>
        </div>
      </div>

      {/* Список постов */}
      {posts.length > 0 ? (
        posts.map(post => (
          <VkPostCard key={post.id} post={post} authorName={authorName} authorAvatar={authorAvatar} />
        ))
      ) : (
        <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-8 text-center'>
          <p className='text-[#828282]'>
            {isAuthenticated ? emptyText : 'Войдите, чтобы увидеть и создавать записи'}
          </p>
          {isAuthenticated ? (
            <button
              onClick={onCreatePost}
              className='mt-3 inline-block rounded-lg bg-[#2688eb] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2076d1]'
            >
              Создать пост
            </button>
          ) : (
            <Link
              href={PATH.SING_IN}
              className='mt-3 inline-block rounded-lg bg-[#2688eb] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2076d1]'
            >
              Войти
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
