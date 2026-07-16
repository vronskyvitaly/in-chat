'use client'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'react-toastify'
import { FiX, FiUploadCloud } from 'react-icons/fi'
import { useCreatePostMutation } from '@/features/posts/api'
import { ACCEPT_CONFIG_IMAGE } from '@/features/chat/ui'
import { VkAvatar } from './vk-avatar'

type Props = {
  open: boolean
  onClose: () => void
  authorName: string
  authorAvatar?: string | null
}

export const VkCreatePostModal = ({ open, onClose, authorName, authorAvatar }: Props) => {
  const [createPost, { isLoading }] = useCreatePostMutation()
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Сброс при закрытии + блокировка прокрутки фона
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setText('')
      setPreview(null)
      setFile(null)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Закрытие по Esc
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    if (input.files?.length) {
      const f = input.files[0]
      setFile(f)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    }
  }

  const removeImage = () => {
    setPreview(null)
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const canSubmit = (text.trim().length > 0 || !!file) && !isLoading

  const onSubmit = async () => {
    if (!canSubmit) return
    const formData = new FormData()
    // В модели поста есть заголовок; в VK-стиле его нет — отправляем пустым
    formData.append('title', '')
    formData.append('content', text.trim())
    if (file) formData.append('image', file)

    try {
      await createPost(formData).unwrap()
      toast.success('Запись опубликована')
      onClose()
    } catch {
      toast.error('Не удалось опубликовать запись')
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center'
      onMouseDown={onClose}
    >
      <div
        className='w-full max-w-lg overflow-hidden rounded-2xl border border-[#2a2a2b] bg-[#222222] shadow-2xl'
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Шапка */}
        <header className='flex items-center justify-between border-b border-[#2a2a2b] px-5 py-4'>
          <div className='flex items-center gap-3'>
            <VkAvatar name={authorName} src={authorAvatar} size={40} />
            <div>
              <p className='font-semibold text-[#e1e3e6]'>Новый пост</p>
              <p className='text-xs text-[#828282]'>{authorName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='flex h-8 w-8 items-center justify-center rounded-full text-[#828282] transition-colors hover:bg-[#2f2f30] hover:text-[#e1e3e6]'
          >
            <FiX className='h-5 w-5' />
          </button>
        </header>

        {/* Тело */}
        <div className='space-y-3 px-5 py-4'>
          {/* Область загрузки / превью */}
          {preview ? (
            <div className='relative overflow-hidden rounded-xl'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt='preview' className='max-h-72 w-full object-cover' />
              <button
                onClick={removeImage}
                className='absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80'
              >
                <FiX className='h-4 w-4' />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className='flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#3a3a3b] py-10 transition-colors hover:border-[#2688eb] hover:bg-[#2688eb]/5'
            >
              <FiUploadCloud className='h-9 w-9 text-[#828282]' />
              <span className='font-medium text-[#e1e3e6]'>Добавьте фото или видео</span>
              <span className='rounded-lg bg-[#e1e3e6] px-4 py-1.5 text-sm font-medium text-[#19191a]'>
                Загрузить с устройства
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type='file'
            accept={ACCEPT_CONFIG_IMAGE}
            className='hidden'
            onChange={onFileChange}
          />

          {/* Текст */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            autoFocus
            placeholder='Напишите что-нибудь…'
            className='w-full resize-y rounded-xl bg-[#2a2a2b] px-4 py-3 text-[15px] text-[#e1e3e6] placeholder:text-[#828282] focus:outline-none focus:ring-1 focus:ring-[#2688eb]'
          />
        </div>

        {/* Футер */}
        <footer className='flex items-center justify-end gap-3 border-t border-[#2a2a2b] px-5 py-4'>
          <button
            onClick={onClose}
            className='rounded-lg bg-[#2f2f30] px-4 py-2 text-sm font-medium text-[#e1e3e6] transition-colors hover:bg-[#3a3a3b]'
          >
            Отмена
          </button>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className='rounded-lg bg-[#2688eb] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2076d1] disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isLoading ? 'Публикация…' : 'Опубликовать'}
          </button>
        </footer>
      </div>
    </div>
  )
}
