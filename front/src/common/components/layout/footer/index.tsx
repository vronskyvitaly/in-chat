import { formatTimeUtil } from '@/common/utils'

export const Footer = () => {
  return (
    <footer className='py-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white/30 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-800/30 dark:border-gray-700'>
      <p>
        © {formatTimeUtil(new Date('2025').toString(), 'year')} ChatApp. Built with Next.js and WebSocket
        technology.
      </p>
    </footer>
  )
}
