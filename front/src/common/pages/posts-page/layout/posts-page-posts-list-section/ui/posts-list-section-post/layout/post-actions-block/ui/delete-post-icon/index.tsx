import { FaSpinner, FaTrash } from 'react-icons/fa'

type TProps = {
  postId: number
  isLoadingDeletingPost: boolean
  handleDelete(postId: number): void
}

export const DeletePostIcon = ({ postId, handleDelete, isLoadingDeletingPost }: TProps) => {
  return (
    <button
      onClick={() => handleDelete(postId)}
      disabled={isLoadingDeletingPost}
      className='relative mt-4 cursor-pointer w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed'
      aria-label='Delete post'
      title='Delete post'
    >
      {isLoadingDeletingPost ? (
        <FaSpinner className='w-5 h-5 text-red-600 dark:text-red-400 animate-spin' />
      ) : (
        <FaTrash className='w-5 h-5 text-red-600 dark:text-red-400' />
      )}
      <div className='absolute right-full top-1/9 transform -translate-y-1/2 mr-2 px-2 py-1 cursor-pointer bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
        {isLoadingDeletingPost ? 'Delete...' : 'Delete post'}
      </div>
    </button>
  )
}
