import { formatTimeUtil } from '@/common/utils'
import type { TPost } from '@/features/posts/types'

export const PostContentBlock = ({ post }: { post: TPost }) => {
  return (
    <div className={`${post.imageUrl ? 'pr-16' : 'pr-12'}`}>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>{post.title}</h3>
      <p className='text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-wrap'>{post.content}</p>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>{formatTimeUtil(post.createdAt, 'full')}</p>
      </div>
    </div>
  )
}
