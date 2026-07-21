'use client'
import { FiPlusCircle } from 'react-icons/fi'

type Props = {
  onClick?: () => void
}

/**
 * Широкая кнопка «Опубликовать» под шапкой профиля.
 * Только для мобильного: на sm+ создание поста живёт в композере ленты.
 */
export const VkPublishButton = ({ onClick }: Props) => (
  <button
    onClick={onClick}
    className='flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a2a2b] bg-[#222222] px-4 py-3 text-[15px] font-medium text-[#e1e3e6] transition-colors hover:bg-[#2a2a2b] sm:hidden'
  >
    <FiPlusCircle className='h-5 w-5 text-[#828282]' />
    Опубликовать
  </button>
)
