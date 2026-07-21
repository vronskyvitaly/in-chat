'use client'
import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { FiMapPin, FiHeart, FiMessageCircle, FiGlobe, FiInfo, FiX, FiAtSign, FiAlignLeft, FiMail } from 'react-icons/fi'
import { LoadingFullScreen } from '@/common/components/ui'
import { PATH } from '@/common/constants'
import { useMeQuery } from '@/features/auth/api'
import { useGetUserByIdQuery } from '@/features/users/api'
import { useGetUserPhotosQuery } from '@/features/photos/api'
import { useFetchUserPostsQuery } from '@/features/posts/api'
import { useGetUserFriendsQuery } from '@/features/friends/api'
import type { TUser } from '@/features/users/types'
import { VkTopBar, VkLeftMenu, VkAvatar, VkPhotos, VkPostCard } from '@/common/pages/home-page/ui/vk'

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const userId = parseInt(id, 10)

  const { data: me } = useMeQuery()
  const { data: user, isLoading } = useGetUserByIdQuery(userId, { skip: !userId })
  const { data: photos = [] } = useGetUserPhotosQuery(userId, { skip: !userId })
  const { data: userPosts = [] } = useFetchUserPostsQuery(userId, { skip: !userId })
  const { data: friends = [] } = useGetUserFriendsQuery(userId, { skip: !userId })

  const [isDetailsOpen, setDetailsOpen] = useState(false)

  if (isLoading) return <LoadingFullScreen />
  if (!user) {
    return (
      <main className='flex min-h-screen items-center justify-center bg-[#19191a] text-[#e1e3e6]'>
        <p className='text-[#828282]'>Пользователь не найден</p>
      </main>
    )
  }

  const isSelf = me?.id === user.id

  // Рендерится дважды: в строке с именем (sm+) и отдельным блоком под инфо (мобильный)
  const actionButton = isSelf ? (
    <Link
      href={PATH.PROFILE}
      className='rounded-lg bg-[#2f2f30] px-4 py-1.5 text-[13px] font-medium text-[#e1e3e6] transition-colors hover:bg-[#3a3a3b]'
    >
      Редактировать профиль
    </Link>
  ) : (
    <Link
      href={`${PATH.CHAT}/${user.id}`}
      className='flex items-center gap-2 rounded-lg bg-[#2688eb] px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#2076d1]'
    >
      <FiMessageCircle className='h-4 w-4' />
      Написать сообщение
    </Link>
  )

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar name={me?.name} avatar={me?.avatar} />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        <VkLeftMenu />

        {/* Контент: шапка на всю ширину, под ней две колонки */}
        <div className='min-w-0 flex-1 space-y-3'>
          {/* Шапка профиля */}
          <section className='overflow-hidden rounded-xl border border-[#2a2a2b] bg-[#222222]'>
            <div
              className={
                user.coverUrl
                  ? 'relative h-40 w-full sm:h-52 bg-[#2c5364]'
                  : user.coverColor
                    ? 'relative h-40 w-full sm:h-52'
                    : 'relative h-40 w-full bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] sm:h-52'
              }
              style={user.coverColor && !user.coverUrl ? { background: user.coverColor } : undefined}
            >
              {user.coverUrl ? (
                <img
                  src={user.coverUrl}
                  alt='Обложка профиля'
                  className='absolute inset-0 h-full w-full object-cover'
                />
              ) : !user.coverColor ? (
                <div
                  className='absolute inset-0 opacity-30'
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(120,200,255,0.15) 23px, transparent 24px)'
                  }}
                />
              ) : null}
            </div>

            {/* Инфо: на мобильном — колонка по центру, на sm+ — аватар слева, текст справа */}
            <div className='p-4 sm:p-6'>
              <div className='flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left'>
                {/* Аватар — наполовину выступает над обложкой */}
                <div className='relative -mt-14 shrink-0 sm:-mt-16'>
                  <div className='rounded-full border-4 border-[#222222]'>
                    <VkAvatar name={user.name} src={user.avatar} size={128} mobileSize={104} />
                  </div>
                  {user.isOnline && (
                    <span className='absolute bottom-2 right-2 h-4 w-4 rounded-full border-[3px] border-[#222222] bg-[#4bb34b] sm:bottom-3 sm:right-3' />
                  )}
                </div>

                <div className='w-full min-w-0 flex-1 sm:pt-2'>
                  {/* Строка 1: Имя + кнопка (кнопка на мобильном уезжает вниз) */}
                  <div className='flex items-center gap-3'>
                    <h1 className='min-w-0 flex-1 truncate text-[20px] font-bold leading-tight text-[#e1e3e6] sm:text-[22px]'>
                      {user.name}
                    </h1>
                    <div className='ml-auto hidden shrink-0 items-center gap-2 sm:flex'>
                      {actionButton}
                    </div>
                  </div>

                  {/* Строка 2: Статус */}
                  {user.status && (
                    <p className='mt-1 text-[14px] text-[#828282]'>{user.status}</p>
                  )}

                  {/* Строка 3: Город, подробнее */}
                  <div className='mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-[#828282] sm:justify-start'>
                    {user.city && (
                      <span className='flex items-center gap-1.5'>
                        <FiMapPin className='h-3.5 w-3.5' />
                        {user.city}
                      </span>
                    )}
                    <button
                      onClick={() => setDetailsOpen(true)}
                      className='flex items-center gap-1.5 text-[#828282] transition-colors hover:text-[#e1e3e6]'
                    >
                      <FiInfo className='h-3.5 w-3.5' />
                      Подробнее
                    </button>
                  </div>

                  {/* Кнопка действия во всю ширину — только на мобильном */}
                  <div className='mt-3 sm:hidden [&>a]:flex [&>a]:w-full [&>a]:justify-center [&>a]:py-2'>
                    {actionButton}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className='flex items-start gap-4'>
            {/* Центральная колонка */}
            <div className='min-w-0 flex-1 space-y-3'>
              {/* Фотографии (только просмотр) */}
              <VkPhotos photos={photos} ownerName={user.name} ownerAvatar={user.avatar} />

              {/* Посты пользователя */}
              {userPosts.length > 0 && (
                <section className='space-y-3'>
                  <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] px-4 py-3'>
                    <h2 className='font-medium text-[#e1e3e6]'>
                      Записи <span className='text-[#828282]'>{userPosts.length}</span>
                    </h2>
                  </div>
                  {userPosts.map(post => (
                    <VkPostCard
                      key={post.id}
                      post={post}
                      authorName={user.name}
                      authorAvatar={user.avatar}
                    />
                  ))}
                </section>
              )}
            </div>

            {/* Правая колонка — друзья */}
            <aside className='sticky top-[72px] hidden max-h-[calc(100vh-88px)] w-[260px] shrink-0 space-y-3 self-start overflow-y-auto xl:block'>
              <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
                <div className='mb-3 flex items-baseline gap-2'>
                  <span className='font-medium text-[#e1e3e6]'>Друзья</span>
                  <span className='text-sm text-[#828282]'>{friends.length}</span>
                </div>
                {friends.length > 0 ? (
                  <div className='grid grid-cols-4 gap-2'>
                    {friends.slice(0, 4).map(f => (
                      <Link key={f.id} href={`${PATH.USERS}/${f.id}`} className='group text-center'>
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
          </div>
        </div>
      </div>

      <UserDetailsModal user={user} friends={friends} open={isDetailsOpen} onClose={() => setDetailsOpen(false)} />
    </main>
  )
}

/* ---- Модалка «Подробная информация» для профиля пользователя ---- */

type DetailsProps = {
  user: TUser
  friends: TUser[]
  open: boolean
  onClose: () => void
}

function UserDetailsModal({ user, friends, open, onClose }: DetailsProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const nickname = user.email ? user.email.split('@')[0] : null
  const hasPersonal = !!(user.city || (user.languages && user.languages.length) || user.maritalStatus)

  const Row = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div className='flex gap-4 py-1.5 text-[15px]'>
        <span className='w-40 shrink-0 text-[#828282]'>{label}</span>
        <span className='text-[#e1e3e6]'>{value}</span>
      </div>
    ) : null

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center'
      onMouseDown={onClose}
    >
      <div
        className='w-full max-w-xl overflow-hidden rounded-2xl border border-[#2a2a2b] bg-[#232324] shadow-2xl'
        onMouseDown={e => e.stopPropagation()}
      >
        <header className='flex items-center justify-between border-b border-[#2a2a2b] px-6 py-4'>
          <h2 className='text-lg font-semibold text-[#e1e3e6]'>Подробная информация</h2>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full text-[#828282] transition-colors hover:bg-[#2f2f30] hover:text-[#e1e3e6]'
          >
            <FiX className='h-5 w-5' />
          </button>
        </header>

        <div className='max-h-[75vh] overflow-y-auto px-6 py-4'>
          {/* Основное */}
          <div className='space-y-3 pb-4'>
            {user.status && (
              <div className='flex items-center gap-3 text-[15px] text-[#e1e3e6]'>
                <FiAlignLeft className='h-5 w-5 shrink-0 text-[#828282]' />
                {user.status}
              </div>
            )}
            {nickname && (
              <div className='flex items-center gap-3 text-[15px]'>
                <FiAtSign className='h-5 w-5 shrink-0 text-[#828282]' />
                <span className='text-[#5b9bea]'>{nickname}</span>
              </div>
            )}
            {user.city && (
              <div className='flex items-center gap-3 text-[15px]'>
                <FiMapPin className='h-5 w-5 shrink-0 text-[#828282]' />
                <span className='text-[#828282]'>Город:</span>
                <span className='text-[#5b9bea]'>{user.city}</span>
              </div>
            )}
            {user.maritalStatus && (
              <div className='flex items-center gap-3 text-[15px]'>
                <FiHeart className='h-5 w-5 shrink-0 text-[#828282]' />
                <span className='text-[#e1e3e6]'>{user.maritalStatus}</span>
              </div>
            )}
          </div>

          {/* Счётчики */}
          <div className='flex gap-8 border-t border-[#2a2a2b] py-4'>
            <div>
              <p className='text-xl font-semibold text-[#e1e3e6]'>{friends.length}</p>
              <p className='text-sm text-[#828282]'>
                {friends.length === 1 ? 'друг' : 'друзей'}
              </p>
            </div>
          </div>

          {/* Личная информация */}
          {hasPersonal && (
            <div className='border-t border-[#2a2a2b] py-4'>
              <h3 className='mb-2 font-semibold text-[#e1e3e6]'>Личная информация</h3>
              <Row label='Родной город:' value={user.city} />
              <Row label='Языки:' value={user.languages?.join(', ')} />
              <Row label='Семейное положение:' value={user.maritalStatus} />
            </div>
          )}

          {/* Контактная информация */}
          {user.email && (
            <div className='border-t border-[#2a2a2b] py-4'>
              <h3 className='mb-2 font-semibold text-[#e1e3e6]'>Контактная информация</h3>
              <div className='flex items-center gap-3 py-1.5 text-[15px]'>
                <FiMail className='h-5 w-5 shrink-0 text-[#828282]' />
                <span className='text-[#828282]'>Эл. почта:</span>
                <span className='text-[#5b9bea]'>{user.email}</span>
              </div>
            </div>
          )}

          {!user.status && !hasPersonal && (
            <div className='flex flex-col items-center gap-2 py-8 text-center text-[#828282]'>
              <FiGlobe className='h-8 w-8' />
              <p>Информация пока не заполнена</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
