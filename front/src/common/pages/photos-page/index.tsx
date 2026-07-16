'use client'
import { useMemo, useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { FiImage } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useMeQuery } from '@/features/auth/api'
import {
  useGetMyPhotosQuery,
  useUploadPhotosMutation,
  useDeletePhotoMutation
} from '@/features/photos/api'
import type { TPhoto } from '@/features/photos/api'
import { ACCEPT_CONFIG_IMAGE } from '@/features/chat/ui'
import { VkTopBar, VkLeftMenu, VkPhotoViewerModal, VkPageSkeleton } from '@/common/pages/home-page/ui/vk'

export default function PhotosPage() {
  const { data: me } = useMeQuery()
  const { data: photos = [], isLoading } = useGetMyPhotosQuery()
  const [uploadPhotos] = useUploadPhotosMutation()
  const [deletePhoto] = useDeletePhotoMutation()

  const inputRef = useRef<HTMLInputElement>(null)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [menuPhotoId, setMenuPhotoId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const photosByYear = useMemo(() => {
    const map = new Map<number, TPhoto[]>()
    for (const p of photos) {
      const year = new Date(p.createdAt).getFullYear()
      const arr = map.get(year)
      if (arr) arr.push(p)
      else map.set(year, [p])
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0])
  }, [photos])

  // Close context menu on outside click
  useEffect(() => {
    if (menuPhotoId === null) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuPhotoId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuPhotoId])

  const handleUpload = async (files: FileList) => {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i])
    }
    try {
      await uploadPhotos(formData).unwrap()
      toast.success('Фото загружены')
    } catch {
      toast.error('Не удалось загрузить фото')
    }
  }

  const handleDelete = async (photoId: number) => {
    setMenuPhotoId(null)
    try {
      await deletePhoto(photoId).unwrap()
      toast.success('Фото удалено')
    } catch {
      toast.error('Не удалось удалить фото')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleUpload(files)
    if (inputRef.current) inputRef.current.value = ''
  }

  if (isLoading) return <VkPageSkeleton variant='photos' />

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar name={me?.name} avatar={me?.avatar} />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        <VkLeftMenu />

        {/* Центральная колонка */}
        <div className='min-w-0 flex-1 space-y-3'>
          {/* Шапка */}
          <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FiImage className='h-5 w-5 text-[#828282]' />
                <h1 className='text-lg font-semibold text-[#e1e3e6]'>
                  Мои фотографии
                  {photos.length > 0 && (
                    <span className='ml-2 text-sm font-normal text-[#828282]'>{photos.length}</span>
                  )}
                </h1>
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                className='rounded-lg bg-[#2688eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2076d1]'
              >
                Загрузить фото
              </button>
              <input
                ref={inputRef}
                type='file'
                accept={ACCEPT_CONFIG_IMAGE}
                multiple
                className='hidden'
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Фото по годам */}
          {photosByYear.length > 0 ? (
            photosByYear.map(([year, yearPhotos]) => (
              <div key={year} className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
                <h2 className='mb-3 text-sm font-semibold text-[#e1e3e6]'>
                  {year}
                  <span className='ml-2 font-normal text-[#828282]'>{yearPhotos.length}</span>
                </h2>
                <div className='grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6'>
                  {yearPhotos.map(p => {
                    const globalIndex = photos.indexOf(p)
                    return (
                      <div key={p.id} className='group relative'>
                        <button
                          onClick={() => setViewerIndex(globalIndex)}
                          className='relative aspect-square w-full overflow-hidden rounded-lg'
                        >
                          <Image
                            src={p.url}
                            alt=''
                            fill
                            sizes='(max-width: 768px) 25vw, 150px'
                            className='object-cover transition-transform group-hover:scale-105'
                          />
                        </button>
                        {/* Three-dot menu trigger */}
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            setMenuPhotoId(menuPhotoId === p.id ? null : p.id)
                          }}
                          className='absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100'
                        >
                          <svg className='h-3.5 w-3.5' viewBox='0 0 16 16' fill='currentColor'>
                            <circle cx='3' cy='8' r='1.5' />
                            <circle cx='8' cy='8' r='1.5' />
                            <circle cx='13' cy='8' r='1.5' />
                          </svg>
                        </button>
                        {/* Context menu */}
                        {menuPhotoId === p.id && (
                          <div
                            ref={menuRef}
                            className='absolute right-0 top-8 z-10 w-[140px] rounded-lg bg-[#2a2a2b] py-1 shadow-lg'
                          >
                            <button
                              onClick={() => setMenuPhotoId(null)}
                              className='flex w-full items-center px-3 py-2 text-sm text-[#e1e3e6] transition-colors hover:bg-[#3a3a3b]'
                            >
                              Поделиться
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className='flex w-full items-center px-3 py-2 text-sm text-[#e64646] transition-colors hover:bg-[#3a3a3b]'
                            >
                              Удалить
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-8'>
              <div className='flex flex-col items-center justify-center'>
                <FiImage className='mb-3 h-12 w-12 text-[#828282]' />
                <p className='text-[#828282]'>Фотографий пока нет</p>
                <button
                  onClick={() => inputRef.current?.click()}
                  className='mt-3 rounded-lg bg-[#2688eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2076d1]'
                >
                  Загрузить первое фото
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <VkPhotoViewerModal
        photos={photos}
        initialIndex={viewerIndex ?? 0}
        open={viewerIndex !== null}
        onClose={() => setViewerIndex(null)}
        onDelete={id => handleDelete(id)}
        ownerName={me?.name}
        ownerAvatar={me?.avatar}
      />
    </main>
  )
}
