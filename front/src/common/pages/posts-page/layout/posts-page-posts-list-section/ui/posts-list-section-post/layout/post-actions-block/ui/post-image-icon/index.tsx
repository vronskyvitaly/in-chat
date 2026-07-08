import { FaImage } from 'react-icons/fa'

type TProps = {
  isPostImage: boolean
  toggle(): void
  isLoadingDeletingPost: boolean
}

export const PostImageIcon = ({ isPostImage, toggle, isLoadingDeletingPost }: TProps) => {
  if (!isPostImage) {
    return null
  }

  return (
    isPostImage && (
      <button
        disabled={isLoadingDeletingPost}
        onClick={() => toggle()}
        className='relative cursor-pointer w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors group disabled:cursor-not-allowed'
        aria-label='Show image'
        title='Show image'
      >
        <FaImage className='w-5 h-5 text-blue-600 dark:text-blue-400' />
        <div className='absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
          Show image
        </div>
      </button>
    )
  )
}
