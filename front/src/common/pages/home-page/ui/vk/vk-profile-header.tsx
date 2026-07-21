'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FiMapPin, FiInfo, FiCamera, FiImage, FiTrash2 } from 'react-icons/fi'
import { PATH } from '@/common/constants'
import { VkAvatar } from './vk-avatar'
import { VkProfileDetailsModal } from './vk-profile-details-modal'
import { SkeletonLine } from './vk-skeleton-primitives'
import Wheel from '@uiw/react-color-wheel'

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #FF3CAC, #784BA0, #2B86C5)'
]

type Props = {
  name?: string
  status?: string
  city?: string
  avatar?: string | null
  isOnline?: boolean
  isAuthenticated?: boolean
  coverUrl?: string | null
  coverColor?: string | null
  onUploadCover?: (file: File) => void
  onChangeCoverColor?: (color: string) => void
  onRemoveCover?: () => void
  isLoading?: boolean
}

export const VkProfileHeader = ({
  name = '',
  status = '',
  city = '',
  avatar,
  isOnline,
  isAuthenticated = false,
  coverUrl,
  coverColor,
  onUploadCover,
  onChangeCoverColor,
  onRemoveCover,
  isLoading
}: Props) => {
  const [isDetailsOpen, setDetailsOpen] = useState(false)
  const [isCoverMenuOpen, setCoverMenuOpen] = useState(false)
  const [wheelColor, setWheelColor] = useState('#2c5364')
  const coverMenuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasCustomCover = !!(coverUrl || coverColor)

  useEffect(() => {
    if (!isCoverMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (coverMenuRef.current && !coverMenuRef.current.contains(e.target as Node)) {
        setCoverMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isCoverMenuOpen])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUploadCover) {
      onUploadCover(file)
    }
    setCoverMenuOpen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (isLoading) {
    return (
      <section className='overflow-hidden rounded-xl border border-[#2a2a2b] bg-[#222222]'>
        {/* Обложка */}
        <div className='h-40 w-full animate-pulse bg-[#2a2a2b] sm:h-52' />

        {/* Инфо */}
        <div className='p-4 sm:p-6'>
          <div className='flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-4'>
            {/* Аватар — наполовину выступает над обложкой */}
            <div className='-mt-14 shrink-0 rounded-full border-4 border-[#222222] sm:-mt-16'>
              <div className='h-[104px] w-[104px] animate-pulse rounded-full bg-[#2a2a2b] sm:h-32 sm:w-32' />
            </div>

            <div className='w-full min-w-0 flex-1 sm:pt-2'>
              {/* Строка 1: Имя + кнопка */}
              <div className='flex items-center gap-3'>
                <SkeletonLine className='h-6 w-1/3' />
                <div className='ml-auto hidden sm:block'>
                  <SkeletonLine className='h-8 w-40 rounded-lg' />
                </div>
              </div>
              {/* Строка 2: Статус */}
              <SkeletonLine className='mt-2 h-4 w-1/4' />
              {/* Строка 3: Детали */}
              <SkeletonLine className='mt-2 h-3 w-1/5' />
              {/* Кнопка действия — только на мобильном */}
              <SkeletonLine className='mt-3 h-9 w-full rounded-lg sm:hidden' />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Определяем стиль обложки
  const coverStyle: React.CSSProperties = coverUrl
    ? {}
    : coverColor
      ? { background: coverColor }
      : {}

  const coverClassName = coverUrl
    ? 'relative h-40 w-full sm:h-52 bg-[#2c5364]'
    : coverColor
      ? 'relative h-40 w-full sm:h-52'
      : 'relative h-40 w-full bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] sm:h-52'

  // Рендерится дважды: в строке с именем (sm+) и отдельным блоком под инфо (мобильный)
  const actionButton = isAuthenticated ? (
    <Link
      href={PATH.PROFILE}
      className='rounded-lg bg-[#2f2f30] px-4 py-1.5 text-[13px] font-medium text-[#e1e3e6] transition-colors hover:bg-[#3a3a3b]'
    >
      Редактировать профиль
    </Link>
  ) : (
    <Link
      href={PATH.SING_IN}
      className='rounded-lg bg-[#2688eb] px-5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#2076d1]'
    >
      Войти
    </Link>
  )

  return (
    <>
    <section className='overflow-hidden rounded-xl border border-[#2a2a2b] bg-[#222222]'>
      {/* Обложка */}
      <div className={coverClassName} style={coverStyle}>
          {coverUrl ? (
            <img
              src={coverUrl}
              alt='Обложка профиля'
              className='absolute inset-0 h-full w-full object-cover'
            />
          ) : !coverColor ? (
            <>
              <div
                className='absolute inset-0 opacity-30'
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(120,200,255,0.15) 23px, transparent 24px)'
                }}
              />
              <pre className='absolute right-6 top-4 hidden select-none text-[11px] leading-4 text-emerald-300/40 md:block'>
{`<link rel="stylesheet" href="css/theme.css">
</head>
<body>
  <div class="banner">
  <nav class="nav">`}
              </pre>
            </>
          ) : null}

          {/* Кнопка изменения обложки */}
          {isAuthenticated && (
            <div className='absolute right-3 top-3 z-10' ref={coverMenuRef}>
              <button
                onClick={() => setCoverMenuOpen(prev => !prev)}
                className='flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60'
              >
                <FiCamera className='h-3.5 w-3.5' />
                <span className='hidden sm:inline'>Изменить обложку</span>
              </button>

              {isCoverMenuOpen && (
                <div className='absolute right-0 top-full mt-1.5 w-[calc(100vw-2rem)] max-w-64 overflow-hidden rounded-xl border border-[#2a2a2b] bg-[#222222] shadow-xl sm:w-64'>
                  {/* Загрузить фото */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className='flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#e1e3e6] transition-colors hover:bg-[#2f2f30]'
                  >
                    <FiImage className='h-4 w-4 text-[#828282]' />
                    Загрузить фото
                  </button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileSelect}
                  />

                  {/* Палитра градиентов */}
                  <div className='border-t border-[#2a2a2b] px-4 py-3'>
                    <p className='mb-2 text-xs text-[#828282]'>Выбрать градиент</p>
                    <div className='grid grid-cols-4 gap-2'>
                      {COVER_GRADIENTS.map(gradient => (
                        <button
                          key={gradient}
                          onClick={() => {
                            onChangeCoverColor?.(gradient)
                            setCoverMenuOpen(false)
                          }}
                          className='h-8 w-full rounded-lg border-2 border-transparent transition-all hover:border-white/50 hover:scale-110'
                          style={{ background: gradient }}
                          title='Выбрать градиент'
                        />
                      ))}
                    </div>
                  </div>

                  {/* Цветовое колесо */}
                  <div className='border-t border-[#2a2a2b] px-4 py-3'>
                    <p className='mb-2 text-xs text-[#828282]'>Выбрать цвет</p>
                    <div className='flex items-center gap-3'>
                      <Wheel
                        color={wheelColor}
                        onChange={color => setWheelColor(color.hex)}
                        width={120}
                        height={120}
                      />
                      <div className='flex flex-col gap-2'>
                        <div
                          className='h-8 w-8 rounded-lg border border-[#3a3a3b]'
                          style={{ background: wheelColor }}
                        />
                        <button
                          onClick={() => {
                            onChangeCoverColor?.(wheelColor)
                            setCoverMenuOpen(false)
                          }}
                          className='rounded-lg bg-[#2688eb] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2076d1]'
                        >
                          ОК
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Удалить обложку */}
                  {hasCustomCover && (
                    <button
                      onClick={() => {
                        onRemoveCover?.()
                        setCoverMenuOpen(false)
                      }}
                      className='flex w-full items-center gap-2.5 border-t border-[#2a2a2b] px-4 py-2.5 text-sm text-[#e87272] transition-colors hover:bg-[#2f2f30]'
                    >
                      <FiTrash2 className='h-4 w-4' />
                      Удалить обложку
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
      </div>

      {/* Инфо: на мобильном — колонка по центру, на sm+ — аватар слева, текст справа */}
      <div className='p-4 sm:p-6'>
      <div className='flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left'>
        {/* Аватар — наполовину выступает над обложкой */}
        <div className='relative -mt-14 shrink-0 sm:-mt-16'>
          <div className='rounded-full border-4 border-[#222222]'>
            <VkAvatar name={name} src={avatar} size={128} mobileSize={104} />
          </div>
          {isOnline && (
            <span className='absolute bottom-2 right-2 h-4 w-4 rounded-full border-[3px] border-[#222222] bg-[#4bb34b] sm:bottom-3 sm:right-3' />
          )}
        </div>

        {/* Тело профиля */}
        <div className='w-full min-w-0 flex-1 sm:pt-2'>
          {/* Строка 1: Имя + кнопка (кнопка на мобильном уезжает вниз) */}
          <div className='flex items-center gap-3'>
            <h1 className='min-w-0 flex-1 truncate text-[20px] font-bold leading-tight text-[#e1e3e6] sm:text-[22px]'>
              {name}
            </h1>
            <div className='ml-auto hidden shrink-0 items-center gap-2 sm:flex'>{actionButton}</div>
          </div>

          {/* Строка 2: Статус */}
          <p className='mt-1 text-[14px] text-[#828282]'>{status}</p>

          {/* Строка 3: Город, семейное положение, подробнее */}
          <div className='mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-[#828282] sm:justify-start'>
            <span className='flex items-center gap-1.5'>
              <FiMapPin className='h-3.5 w-3.5' />
              {city}
            </span>
            <button
              onClick={() => setDetailsOpen(true)}
              className='flex items-center gap-1.5 text-[#828282] transition-colors hover:text-[#e1e3e6]'
            >
              <FiInfo className='h-3.5 w-3.5' />
              Подробнее
            </button>
          </div>

          {/* Кнопка действия во всю ширину — только на мобильном */}
          <div className='mt-3 sm:hidden [&>a]:block [&>a]:w-full [&>a]:py-2 [&>a]:text-center'>
            {actionButton}
          </div>
        </div>
      </div>
      </div>
    </section>

    <VkProfileDetailsModal open={isDetailsOpen} onClose={() => setDetailsOpen(false)} />
    </>
  )
}
