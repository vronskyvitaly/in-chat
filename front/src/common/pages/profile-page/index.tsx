'use client'
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { FiX, FiCamera } from 'react-icons/fi'
import { PATH } from '@/common/constants'
import { useMeQuery, useUpdateProfileMutation, useUploadAvatarMutation } from '@/features/auth/api'
import { useFetchPostsQuery } from '@/features/posts/api'
import { useGetMyPhotosQuery, useUploadPhotosMutation, useDeletePhotoMutation } from '@/features/photos/api'
import { ACCEPT_CONFIG_IMAGE } from '@/features/chat/ui'
import { VkTopBar, VkLeftMenu, VkAvatar, VkPhotos, VkPostsFeed, VkCreatePostModal, VkPageSkeleton } from '@/common/pages/home-page/ui/vk'

const MARITAL_OPTIONS = [
  'Не выбрано',
  'Не женат / Не замужем',
  'Встречается',
  'Помолвлен(а)',
  'Женат / Замужем',
  'Всё сложно',
  'В активном поиске',
  'Влюблён(а)',
  'В гражданском браке'
]

const SIDE_TABS = [
  'Профиль',
  'Контакты',
  'Интересы',
  'Образование',
  'Карьера',
  'Военная служба',
  'Жизненная позиция'
]

export default function ProfilePage() {
  const router = useRouter()
  const { data: me, isLoading } = useMeQuery()
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [isCreatePostOpen, setCreatePostOpen] = useState(false)
  const { data: posts = [] } = useFetchPostsQuery()
  const { data: photos = [] } = useGetMyPhotosQuery()
  const [uploadPhotos] = useUploadPhotosMutation()
  const [deletePhoto] = useDeletePhotoMutation()

  const onPhotosUpload = async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('photos', file))
    try {
      await uploadPhotos(formData).unwrap()
      toast.success('Фото загружены')
    } catch {
      toast.error('Не удалось загрузить фото')
    }
  }

  const onPhotoDelete = async (photoId: number) => {
    try {
      await deletePhoto(photoId).unwrap()
      toast.success('Фото удалено')
    } catch {
      toast.error('Не удалось удалить фото')
    }
  }

  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [city, setCity] = useState('')
  const [maritalStatus, setMaritalStatus] = useState(MARITAL_OPTIONS[0])
  const [languages, setLanguages] = useState<string[]>([])
  const [langInput, setLangInput] = useState('')

  // Инициализация формы данными из БД
  useEffect(() => {
    if (!me) return
    setName(me.name ?? '')
    setStatus(me.status ?? '')
    setCity(me.city ?? '')
    setMaritalStatus(me.maritalStatus || MARITAL_OPTIONS[0])
    setLanguages(me.languages ?? [])
  }, [me])

  const addLanguage = () => {
    const value = langInput.trim()
    if (value && !languages.includes(value)) {
      setLanguages(prev => [...prev, value])
    }
    setLangInput('')
  }

  const onLangKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addLanguage()
    }
  }

  const removeLanguage = (lang: string) => {
    setLanguages(prev => prev.filter(l => l !== lang))
  }

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      await uploadAvatar(formData).unwrap()
      toast.success('Аватар обновлён')
    } catch {
      toast.error('Не удалось загрузить аватар')
    } finally {
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  const onSave = async () => {
    if (!name.trim()) {
      toast.error('Имя не может быть пустым')
      return
    }
    try {
      await updateProfile({
        name: name.trim(),
        status,
        city,
        maritalStatus: maritalStatus === MARITAL_OPTIONS[0] ? '' : maritalStatus,
        languages
      }).unwrap()
      toast.success('Профиль сохранён')
      router.push(PATH.HOME)
    } catch {
      toast.error('Не удалось сохранить профиль')
    }
  }

  if (isLoading) return <VkPageSkeleton variant='settings' />

  const inputClass =
    'w-full rounded-lg border border-[#3a3a3b] bg-[#2a2a2b] px-3 py-2.5 text-sm text-[#e1e3e6] placeholder:text-[#828282] focus:border-[#2688eb] focus:outline-none'
  const labelClass = 'text-sm text-[#828282] sm:pt-2.5 sm:text-right'

  return (
    <main className='min-h-screen bg-[#19191a] text-[#e1e3e6]'>
      <VkTopBar name={me?.name} avatar={me?.avatar} />

      <div className='mx-auto flex max-w-[1100px] items-start gap-4 px-2 py-4 sm:px-3'>
        <VkLeftMenu />

        {/* Центр: форма */}
        <div className='min-w-0 flex-1 space-y-3'>
          {/* Шапка карточки профиля */}
          <section className='rounded-xl border border-[#2a2a2b] bg-[#222222]'>
            <div className='flex items-center justify-between px-4 pt-4'>
              <h1 className='text-lg font-semibold'>Профиль</h1>
            </div>
            <div className='relative mt-3 h-32 w-full rounded-t-xl bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]'>
              <button className='absolute right-4 top-4 rounded-lg bg-black/40 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-black/60'>
                Изменить обложку
              </button>
            </div>
            <div className='flex items-end gap-4 px-4 pb-4'>
              <div className='relative z-10 -mt-10'>
                <button
                  type='button'
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  title='Загрузить аватар'
                  className='group relative block rounded-full border-4 border-[#222222]'
                >
                  <VkAvatar name={me?.name} src={me?.avatar} size={88} />
                  <span className='absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100'>
                    {isUploadingAvatar ? (
                      <span className='h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    ) : (
                      <FiCamera className='h-6 w-6 text-white' />
                    )}
                  </span>
                </button>
                <input
                  ref={avatarInputRef}
                  type='file'
                  accept={ACCEPT_CONFIG_IMAGE}
                  className='hidden'
                  onChange={onAvatarChange}
                />
              </div>
              <div className='min-w-0 pb-1'>
                <p className='truncate text-lg font-semibold'>{name || me?.name}</p>
                <p className='truncate text-sm text-[#828282]'>{me?.email}</p>
              </div>
            </div>
          </section>

          {/* Фотографии */}
          <VkPhotos
            photos={photos}
            onUpload={onPhotosUpload}
            onDelete={onPhotoDelete}
            isEditable
            ownerName={me?.name}
            ownerAvatar={me?.avatar}
          />

          {/* Форма редактирования */}
          <section className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4 sm:p-6'>
            <div className='space-y-4'>
              <div className='grid gap-1.5 sm:grid-cols-[180px_1fr] sm:items-start sm:gap-4'>
                <label className={labelClass}>Имя:</label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder='Ваше имя'
                />
              </div>

              <div className='grid gap-1.5 sm:grid-cols-[180px_1fr] sm:items-start sm:gap-4'>
                <label className={labelClass}>Краткая информация:</label>
                <textarea
                  className={`${inputClass} min-h-24 resize-y`}
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  placeholder='Например: FullStack developer'
                />
              </div>

              <div className='grid gap-1.5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-4'>
                <label className={labelClass}>Семейное положение:</label>
                <select
                  className={inputClass}
                  value={maritalStatus}
                  onChange={e => setMaritalStatus(e.target.value)}
                >
                  {MARITAL_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className='bg-[#2a2a2b]'>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className='grid gap-1.5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-4'>
                <label className={labelClass}>Родной город:</label>
                <input
                  className={inputClass}
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder='Например: Пинск'
                />
              </div>

              <div className='grid gap-1.5 sm:grid-cols-[180px_1fr] sm:items-start sm:gap-4'>
                <label className={labelClass}>Владение языками:</label>
                <div>
                  <div className='flex flex-wrap items-center gap-2 rounded-lg border border-[#3a3a3b] bg-[#2a2a2b] px-2 py-2'>
                    {languages.map(lang => (
                      <span
                        key={lang}
                        className='flex items-center gap-1 rounded bg-[#3a3a3b] px-2 py-1 text-sm text-[#e1e3e6]'
                      >
                        {lang}
                        <button
                          type='button'
                          onClick={() => removeLanguage(lang)}
                          className='text-[#828282] hover:text-white'
                        >
                          <FiX className='h-3.5 w-3.5' />
                        </button>
                      </span>
                    ))}
                    <input
                      className='min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm text-[#e1e3e6] placeholder:text-[#828282] focus:outline-none'
                      value={langInput}
                      onChange={e => setLangInput(e.target.value)}
                      onKeyDown={onLangKeyDown}
                      onBlur={addLanguage}
                      placeholder={languages.length ? '' : 'Русский, English…'}
                    />
                  </div>
                  <p className='mt-1 text-xs text-[#828282]'>Введите язык и нажмите Enter</p>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className='mt-6 flex items-center justify-center gap-3'>
              <button
                onClick={onSave}
                disabled={isSaving}
                className='rounded-lg bg-[#2688eb] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2076d1] disabled:opacity-60'
              >
                {isSaving ? 'Сохранение…' : 'Сохранить'}
              </button>
              <button
                onClick={() => router.push(PATH.HOME)}
                className='rounded-lg bg-[#2f2f30] px-6 py-2.5 text-sm font-medium text-[#e1e3e6] transition-colors hover:bg-[#3a3a3b]'
              >
                Отмена
              </button>
            </div>
          </section>

          {/* Мои посты */}
          <VkPostsFeed
            posts={posts}
            authorName={me?.name ?? ''}
            authorAvatar={me?.avatar}
            isAuthenticated={!!me}
            onCreatePost={() => setCreatePostOpen(true)}
            feedTitle='Мои посты'
            showArchive
            emptyText='У вас пока нет записей'
          />
        </div>

        {/* Правая колонка: разделы «Личные данные» */}
        <aside className='hidden w-[280px] shrink-0 xl:block'>
          <div className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-2'>
            <div className='px-3 py-2'>
              <p className='font-semibold'>Личные данные</p>
              <p className='text-xs text-[#828282]'>Имя, статус, город, семейное положение</p>
            </div>
            <ul className='mt-1'>
              {SIDE_TABS.map((tab, i) => (
                <li key={tab}>
                  <button
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      i === 0
                        ? 'bg-[#2f2f30] font-medium text-[#e1e3e6]'
                        : 'text-[#aeb0b3] hover:bg-[#232324] hover:text-[#e1e3e6]'
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <VkCreatePostModal
        open={isCreatePostOpen}
        onClose={() => setCreatePostOpen(false)}
        authorName={me?.name ?? ''}
        authorAvatar={me?.avatar}
      />
    </main>
  )
}
