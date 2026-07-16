'use client'
import { useState, useEffect, useCallback, useRef, type KeyboardEvent } from 'react'
import Image from 'next/image'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useMeQuery } from '@/features/auth/api'
import { useGetPhotoCommentsQuery, useAddPhotoCommentMutation } from '@/features/photos/api'
import type { TPhoto } from '@/features/photos/api'
import { formatTimeUtil } from '@/common/utils'
import { VkAvatar } from './vk-avatar'

type Props = {
  photos: TPhoto[]
  initialIndex: number
  open: boolean
  onClose: () => void
  onDelete?: (photoId: number) => void
  ownerName?: string
  ownerAvatar?: string | null
}

export const VkPhotoViewerModal = ({
  photos,
  initialIndex,
  open,
  onClose,
  onDelete,
  ownerName,
  ownerAvatar
}: Props) => {
  const [index, setIndex] = useState(initialIndex)
  const [text, setText] = useState('')
  const commentsEndRef = useRef<HTMLDivElement>(null)

  const { data: me } = useMeQuery()
  const photo = photos[index]
  const isOwner = me && photo && me.id === photo.userId

  const { data: comments = [], isLoading: commentsLoading } = useGetPhotoCommentsQuery(photo?.id, {
    skip: !open || !photo
  })
  const [addComment, { isLoading: isSending }] = useAddPhotoCommentMutation()

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [comments.length])

  const prev = useCallback(() => {
    setIndex(i => (i > 0 ? i - 1 : photos.length - 1))
  }, [photos.length])

  const next = useCallback(() => {
    setIndex(i => (i < photos.length - 1 ? i + 1 : 0))
  }, [photos.length])

  useEffect(() => {
    if (!open) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, prev, next])

  const handleDelete = () => {
    if (!onDelete || !photo) return
    onDelete(photo.id)
    if (photos.length <= 1) {
      onClose()
    } else if (index >= photos.length - 1) {
      setIndex(i => i - 1)
    }
  }

  const submit = async () => {
    const content = text.trim()
    if (!content || isSending || !photo) return
    try {
      await addComment({ photoId: photo.id, content }).unwrap()
      setText('')
    } catch {
      /* ignore */
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  if (!open || !photo) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80' onClick={onClose}>
      <div
        className='relative flex h-[80vh] max-h-[700px] w-[90vw] max-w-[1000px] overflow-hidden rounded-xl bg-[#222222]'
        onClick={e => e.stopPropagation()}
      >
        {/* Левая часть — фото */}
        <div className='relative flex flex-1 items-center justify-center bg-black'>
          <Image
            src={photo.url}
            alt='Фото'
            fill
            sizes='(max-width: 768px) 100vw, 60vw'
            className='object-contain'
          />

          {/* Навигация */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className='absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70'
              >
                <FiChevronLeft className='h-6 w-6' />
              </button>
              <button
                onClick={next}
                className='absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70'
              >
                <FiChevronRight className='h-6 w-6' />
              </button>
            </>
          )}
        </div>

        {/* Правая панель — инфо + комментарии */}
        <div className='flex w-[320px] shrink-0 flex-col border-l border-[#2a2a2b]'>
          {/* Шапка */}
          <div className='flex items-center justify-between border-b border-[#2a2a2b] px-4 py-3'>
            <div className='flex items-center gap-3 min-w-0'>
              <VkAvatar
                name={ownerName !== undefined ? ownerName : me?.name}
                src={ownerAvatar !== undefined ? ownerAvatar : me?.avatar}
                size={36}
              />
              <div className='min-w-0'>
                <p className='truncate text-sm font-medium text-[#e1e3e6]'>
                  {ownerName !== undefined ? ownerName : me?.name}
                </p>
                <p className='text-xs text-[#828282]'>
                  {formatTimeUtil(photo.createdAt, 'full')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              title='Закрыть'
              className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#828282] transition-colors hover:bg-[#2a2a2b] hover:text-[#e1e3e6]'
            >
              <FiX className='h-5 w-5' />
            </button>
          </div>

          {/* Комментарии */}
          <div className='flex-1 overflow-y-auto p-3'>
            {commentsLoading ? (
              <p className='text-sm text-[#828282]'>Загрузка комментариев...</p>
            ) : comments.length > 0 ? (
              <div className='space-y-3'>
                {comments.map(c => (
                  <div key={c.id} className='flex gap-2'>
                    <VkAvatar name={c.author.name} src={c.author.avatar} size={30} />
                    <div className='min-w-0 flex-1'>
                      <div className='rounded-2xl rounded-tl-md bg-[#2a2a2b] px-3 py-1.5'>
                        <p className='text-xs font-medium text-[#e1e3e6]'>{c.author.name}</p>
                        <p className='whitespace-pre-line break-words text-sm text-[#dcdee0]'>
                          {c.content}
                        </p>
                      </div>
                      <p className='mt-0.5 pl-1 text-xs text-[#828282]'>
                        {formatTimeUtil(c.createdAt, 'datetime')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            ) : (
              <p className='text-sm text-[#828282]'>Пока нет комментариев</p>
            )}
          </div>

          {/* Поле ввода */}
          <div className='border-t border-[#2a2a2b] px-3 py-2.5'>
            <div className='flex items-center gap-2'>
              <VkAvatar name={me?.name} src={me?.avatar} size={30} />
              <div className='flex flex-1 items-center rounded-2xl border border-[#3a3a3b] bg-[#2a2a2b] pl-3 pr-1.5 transition-colors focus-within:border-[#2688eb]'>
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder='Комментарий...'
                  className='flex-1 bg-transparent py-1.5 text-sm text-[#e1e3e6] placeholder:text-[#828282] focus:outline-none'
                />
                <button
                  onClick={submit}
                  disabled={!text.trim() || isSending}
                  title='Отправить'
                  className='flex h-6 w-6 items-center justify-center rounded-full text-[#5b9bea] transition-colors hover:bg-[#3a3a3b] disabled:cursor-not-allowed disabled:text-[#4a4a4b]'
                >
                  <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 12h14M13 6l6 6-6 6' />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Нижняя панель — действия */}
          <div className='flex items-center justify-between border-t border-[#2a2a2b] px-4 py-2'>
            <span className='text-xs text-[#828282]'>
              Фото {index + 1} из {photos.length}
            </span>
            <div className='flex items-center gap-1 text-xs'>
              <button className='rounded px-2 py-1 text-[#828282] transition-colors hover:text-[#e1e3e6]'>
                Поделиться
              </button>
              {isOwner && onDelete && (
                <>
                  <span className='text-[#3a3a3b]'>·</span>
                  <button
                    onClick={handleDelete}
                    className='rounded px-2 py-1 text-[#828282] transition-colors hover:text-[#e64646]'
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
