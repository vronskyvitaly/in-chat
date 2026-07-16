import Image from 'next/image'

type Props = {
  name?: string | null
  src?: string | null
  size?: number
  className?: string
  ring?: boolean
}

/** Аватар пользователя: картинка либо градиентная заглушка с первой буквой имени. */
export const VkAvatar = ({ name, src, size = 40, className = '', ring = false }: Props) => {
  const letter = name?.trim().charAt(0).toUpperCase() || 'U'
  const ringClass = ring ? 'ring-2 ring-[#3a3a3b]' : ''

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? 'avatar'}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-full object-cover ${ringClass} ${className}`}
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-medium text-white ${ringClass} ${className}`}
    >
      {letter}
    </div>
  )
}
