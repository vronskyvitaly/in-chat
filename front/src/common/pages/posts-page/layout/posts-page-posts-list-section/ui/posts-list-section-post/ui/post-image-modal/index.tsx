'use client'
import Image from 'next/image'

type TPostImageModalProps = {
  imageUrl: string
  title: string
  content: string
  isOpen: boolean
  onClose(): void
}

export const PostImageModal = ({ imageUrl, title, isOpen, content, onClose }: TPostImageModalProps) => {
  if (!isOpen || !imageUrl) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4'
      onClick={onClose}
    >
      <div className='relative max-w-4xl max-h-[90vh] w-full' onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className='absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 z-10'
          aria-label='Close'
        >
          ✕
        </button>
        <div className='bg-white dark:bg-gray-800 rounded-lg overflow-hidden max-w-full max-h-full'>
          <div className='relative w-full h-[70vh]'>
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes='(max-width: 1024px) 100vw, 1024px'
              className='object-contain'
            />
          </div>
          <div className='p-4 text-center border-t border-gray-200 dark:border-gray-700'>
            <p className='text-gray-700 dark:text-gray-300 font-bold'>{title}</p>
            <p className='text-gray-700 dark:text-gray-500 font-medium'>{content}</p>
            <div className='mt-4 flex justify-center gap-4'>
              <button
                onClick={onClose}
                className='px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-medium'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
