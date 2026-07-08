'use client'
import { PostImageModal } from './ui'
import { PostActionsBlock, PostContentBlock } from './layout'
import { useModalActions } from '@/common/hooks'
import type { TPost } from '@/features/posts/types'

export const PostsListSectionPost = ({ post }: { post: TPost }) => {
  const { isOpen, toggle, close } = useModalActions()

  const isPostImage = !!post.imageUrl

  return (
    <>
      {/* Modal window for viewing an image */}
      {isOpen && post.imageUrl && (
        <PostImageModal
          imageUrl={post.imageUrl}
          title={post.title}
          content={post.content}
          isOpen={isOpen}
          onClose={close}
        />
      )}

      <div className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative`}>
        {/* Image viewing block and posts-list-section-post delete icons */}
        <PostActionsBlock toggle={toggle} postId={post.id} isPostImage={isPostImage} />

        {/* Block with the main content of the posts-list-section-post */}
        <PostContentBlock post={post} />
      </div>
    </>
  )
}
