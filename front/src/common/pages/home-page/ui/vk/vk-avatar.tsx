import Image from 'next/image'

type Props = {
  name?: string | null
  src?: string | null
  size?: number
  /** Размер на мобильном (< 640px). Если не задан — используется size на всех экранах. */
  mobileSize?: number
  className?: string
  ring?: boolean
}

/** Аватар пользователя: картинка либо градиентная заглушка с первой буквой имени. */
export const VkAvatar = ({ name, src, size = 40, mobileSize, className = '', ring = false }: Props) => {
  const letter = name?.trim().charAt(0).toUpperCase() || 'U'
  const ringClass = ring ? 'ring-2 ring-[#3a3a3b]' : ''

  // Адаптивный размер задаётся CSS-переменными, чтобы не дублировать разметку под брейкпоинты
  const isResponsive = mobileSize !== undefined && mobileSize !== size
  const sizeStyle = isResponsive
    ? ({ '--vk-avatar': `${mobileSize}px`, '--vk-avatar-sm': `${size}px` } as React.CSSProperties)
    : { width: size, height: size }
  const sizeClass = isResponsive
    ? 'h-[var(--vk-avatar)] w-[var(--vk-avatar)] sm:h-[var(--vk-avatar-sm)] sm:w-[var(--vk-avatar-sm)]'
    : ''

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? 'avatar'}
        width={size}
        height={size}
        style={sizeStyle}
        className={`shrink-0 rounded-full object-cover ${sizeClass} ${ringClass} ${className}`}
      />
    )
  }

  return (
    <div
      style={{ ...sizeStyle, fontSize: (mobileSize ?? size) * 0.4 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-medium text-white ${sizeClass} ${ringClass} ${className}`}
    >
      {letter}
    </div>
  )
}
