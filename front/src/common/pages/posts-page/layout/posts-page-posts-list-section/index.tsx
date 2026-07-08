import type { TPost } from '@/features/posts/types'
import { PostsListSectionPost, PostsListSectionTitle } from './ui'
import { PostsListSectionPostEmptyBlock } from './layout'

type Props = {
  posts: TPost[]
}

export const PostsPagePostsListSection = ({ posts }: Props) => {
  return (
    <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
      <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
        <PostsListSectionTitle />
      </div>
      {posts.length === 0 ? (
        <PostsListSectionPostEmptyBlock />
      ) : (
        <div className='divide-y divide-gray-200 dark:divide-gray-700'>
          {posts.map(post => (
            <PostsListSectionPost post={post} key={post.id} />
          ))}
        </div>
      )}
    </section>
  )
}
