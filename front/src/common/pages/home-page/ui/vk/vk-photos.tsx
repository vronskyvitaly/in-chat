'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { FiImage, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { ACCEPT_CONFIG_IMAGE } from '@/features/chat/ui'
import type { TPhoto } from '@/features/photos/api'
import { VkPhotoViewerModal } from './vk-photo-viewer-modal'
import { SkeletonLine } from './vk-skeleton-primitives'

const COLLAPSED_COUNT = 6

type Props = {
  photos: TPhoto[]
  onUpload?: (files: FileList) => void
  onDelete?: (photoId: number) => void
  isEditable?: boolean
  ownerName?: string
  ownerAvatar?: string | null
  isLoading?: boolean
}

export const VkPhotos = ({ photos, onUpload, onDelete, isEditable = false, ownerName, ownerAvatar, isLoading }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && onUpload) {
      onUpload(files)
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  const hasMore = photos.length > COLLAPSED_COUNT
  const visiblePhotos = expanded ? photos : photos.slice(0, COLLAPSED_COUNT)

  if (isLoading) {
    return (
      <section className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
        <div className='mb-3 flex items-center gap-2'>
          <FiImage className='h-4 w-4 text-[#828282]' />
          <SkeletonLine className='h-3 w-16' />
        </div>
        <div className='grid grid-cols-3 gap-1'>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLine key={i} className='aspect-square w-full rounded-lg' />
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <section className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-3'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FiImage className='h-4 w-4 text-[#828282]' />
            <span className='text-sm font-medium text-[#e1e3e6]'>
              Фотографии{photos.length > 0 && ` ${photos.length}`}
            </span>
          </div>
        </div>

        {photos.length > 0 ? (
          <div className='grid grid-cols-3 gap-1'>
            {visiblePhotos.map((photo, i) => (
              <div
                key={photo.id}
                className='group relative aspect-square cursor-pointer overflow-hidden rounded-lg'
                onClick={() => setViewerIndex(expanded ? i : i)}
              >
                <Image
                  src={photo.url}
                  alt='Фото пользователя'
                  fill
                  sizes='(max-width: 768px) 33vw, 200px'
                  className='object-cover transition-transform group-hover:scale-105'
                />
                {isEditable && onDelete && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      onDelete(photo.id)
                    }}
                    className='absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100'
                  >
                    <FiX className='h-3.5 w-3.5' />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center rounded-lg bg-[#2a2a2b] py-8'>
            <FiImage className='mb-2 h-8 w-8 text-[#828282]' />
            <p className='text-sm text-[#828282]'>Фотографий пока нет</p>
          </div>
        )}

        {hasMore && (
          <button
            onClick={() => setExpanded(prev => !prev)}
            className='mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2f2f30] py-2 text-sm font-medium text-[#e1e3e6] transition-colors hover:bg-[#3a3a3b]'
          >
            {expanded ? (
              <>
                Свернуть <FiChevronUp className='h-4 w-4' />
              </>
            ) : (
              <>
                Показать все {photos.length} <FiChevronDown className='h-4 w-4' />
              </>
            )}
          </button>
        )}

        {isEditable && (
          <div className={hasMore ? 'mt-1.5' : 'mt-3'}>
            <button
              onClick={() => inputRef.current?.click()}
              className='w-full rounded-lg bg-[#2f2f30] py-2.5 text-sm font-medium text-[#e1e3e6] transition-colors hover:bg-[#3a3a3b]'
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
        )}
      </section>

      <VkPhotoViewerModal
        photos={photos}
        initialIndex={viewerIndex ?? 0}
        open={viewerIndex !== null}
        onClose={() => setViewerIndex(null)}
        onDelete={onDelete}
        ownerName={ownerName}
        ownerAvatar={ownerAvatar}
      />
    </>
  )
}
