import Image from 'next/image'

export const Logo = () => {
  return (
    <div className='flex justify-center mb-8'>
      <div className='flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20'>
        <Image className='dark:invert' src='/next.svg' alt='Next.js logo' width={40} height={8} priority />
      </div>
    </div>
  )
}
