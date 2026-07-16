'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMeQuery, useUploadCoverMutation, useUpdateProfileMutation } from '@/features/auth/api'
import { useFetchPostsQuery } from '@/features/posts/api'
import { useGetFriendsQuery } from '@/features/friends/api'
import { useGetMyPhotosQuery, useUploadPhotosMutation, useDeletePhotoMutation } from '@/features/photos/api'
import {
  VkTopBar,
  VkLeftMenu,
  VkProfileHeader,
  VkPhotos,
  VkPostsFeed,
  VkCreatePostModal,
  VkRightColumn,
  VkPageSkeleton
} from './ui/vk'

export default function HomePage() {
  const { data: session, status } = useSession()
  const isAuthenticated = !!session
  const [isCreatePostOpen, setCreatePostOpen] = useState(false)

  const { data: me } = useMeQuery(undefined, { skip: !isAuthenticated })
  // В профиле — только свои посты
  const { data: posts = [] } = useFetchPostsQuery(undefined, { skip: !isAuthenticated })
  const { data: friends = [] } = useGetFriendsQuery(undefined, { skip: !isAuthenticated })
  const { data: photos = [] } = useGetMyPhotosQuery(undefined, { skip: !isAuthenticated })
  const [uploadPhotos] = useUploadPhotosMutation()
  const [deletePhoto] = useDeletePhotoMutation()
  const [uploadCover] = useUploadCoverMutation()
  const [updateProfile] = useUpdateProfileMutation()

  const onPhotosUpload = async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('photos', file))
    try {
      await uploadPhotos(formData).unwrap()
    } catch {
      // ошибка загрузки
    }
  }

  const onPhotoDelete = async (photoId: number) => {
    try {
      await deletePhoto(photoId).unwrap()
    } catch {
      // ошибка удаления
    }
  }

  const onUploadCover = async (file: File) => {
    const formData = new FormData()
    formData.append('cover', file)
    try {
      await uploadCover(formData).unwrap()
    } catch {
      // ошибка загрузки обложки
    }
  }

  const onChangeCoverColor = async (color: string) => {
    try {
      await updateProfile({ coverColor: color }).unwrap()
    } catch {
      // ошибка смены цвета обложки
    }
  }

  const onRemoveCover = async () => {
    try {
      await updateProfile({ removeCover: true }).unwrap()
    } catch {
      // ошибка удаления обложки
    }
  }

  if (status === 'loading') {
    return <VkPageSkeleton variant='profile' />
  }

  const name = me?.name ?? session?.user?.name ?? 'Гость'
  const avatar = me?.avatar ?? session?.user?.image ?? null

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar name={name} avatar={avatar} />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        {/* Левое меню */}
        <VkLeftMenu />

        {/* Контент: шапка на всю ширину, под ней две колонки */}
        <div className='min-w-0 flex-1 space-y-3'>
          <VkProfileHeader
            name={name}
            status={me?.status || 'FullStack developer'}
            city={me?.city || 'Не указан'}
            avatar={avatar}
            isOnline={me?.isOnline}
            isAuthenticated={isAuthenticated}
            coverUrl={me?.coverUrl}
            coverColor={me?.coverColor}
            onUploadCover={onUploadCover}
            onChangeCoverColor={onChangeCoverColor}
            onRemoveCover={onRemoveCover}
          />

          <div className='flex items-start gap-4'>
            {/* Центральная колонка */}
            <div className='min-w-0 flex-1 space-y-3'>
              <VkPhotos photos={photos} onUpload={onPhotosUpload} onDelete={onPhotoDelete} isEditable ownerName={name} ownerAvatar={avatar} />
              <VkPostsFeed
                posts={posts}
                authorName={name}
                authorAvatar={avatar}
                isAuthenticated={isAuthenticated}
                onCreatePost={() => setCreatePostOpen(true)}
              />
            </div>

            {/* Правая колонка */}
            <VkRightColumn friends={friends} />
          </div>
        </div>
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
