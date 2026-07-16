'use client'
import { useEffect } from 'react'
import { FiX, FiAlignLeft, FiAtSign, FiMapPin, FiHeart, FiGlobe, FiMail } from 'react-icons/fi'
import { useMeQuery } from '@/features/auth/api'
import { useGetFriendsQuery } from '@/features/friends/api'

type Props = {
  open: boolean
  onClose: () => void
}

export const VkProfileDetailsModal = ({ open, onClose }: Props) => {
  const { data: me } = useMeQuery(undefined, { skip: !open })
  const { data: friends = [] } = useGetFriendsQuery(undefined, { skip: !open })

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const nickname = me?.email ? me.email.split('@')[0] : null
  const hasPersonal = !!(me?.city || (me?.languages && me.languages.length) || me?.maritalStatus)

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
        {/* Шапка */}
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
            {me?.status && (
              <div className='flex items-center gap-3 text-[15px] text-[#e1e3e6]'>
                <FiAlignLeft className='h-5 w-5 shrink-0 text-[#828282]' />
                {me.status}
              </div>
            )}
            {nickname && (
              <div className='flex items-center gap-3 text-[15px]'>
                <FiAtSign className='h-5 w-5 shrink-0 text-[#828282]' />
                <span className='text-[#5b9bea]'>{nickname}</span>
              </div>
            )}
            {me?.city && (
              <div className='flex items-center gap-3 text-[15px]'>
                <FiMapPin className='h-5 w-5 shrink-0 text-[#828282]' />
                <span className='text-[#828282]'>Город:</span>
                <span className='text-[#5b9bea]'>{me.city}</span>
              </div>
            )}
            {me?.maritalStatus && (
              <div className='flex items-center gap-3 text-[15px]'>
                <FiHeart className='h-5 w-5 shrink-0 text-[#828282]' />
                <span className='text-[#e1e3e6]'>{me.maritalStatus}</span>
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
              <Row label='Родной город:' value={me?.city} />
              <Row label='Языки:' value={me?.languages?.join(', ')} />
              <Row label='Семейное положение:' value={me?.maritalStatus} />
            </div>
          )}

          {/* Контактная информация */}
          {me?.email && (
            <div className='border-t border-[#2a2a2b] py-4'>
              <h3 className='mb-2 font-semibold text-[#e1e3e6]'>Контактная информация</h3>
              <div className='flex items-center gap-3 py-1.5 text-[15px]'>
                <FiMail className='h-5 w-5 shrink-0 text-[#828282]' />
                <span className='text-[#828282]'>Эл. почта:</span>
                <span className='text-[#5b9bea]'>{me.email}</span>
              </div>
            </div>
          )}

          {!me?.status && !hasPersonal && (
            <div className='flex flex-col items-center gap-2 py-8 text-center text-[#828282]'>
              <FiGlobe className='h-8 w-8' />
              <p>Информация пока не заполнена</p>
              <p className='text-sm'>Заполните профиль в разделе «Редактировать профиль»</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
