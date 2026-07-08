import { DeletePostIcon, PostImageIcon } from './ui'
import { useDeletePostMutation } from '@/features/posts/api'

type TProps = {
  toggle: () => void
  isPostImage: boolean
  postId: number
}

export const PostActionsBlock = ({ toggle, postId, isPostImage }: TProps) => {
  const [deletePost, { isLoading: isLoadingDeletingPost }] = useDeletePostMutation()

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId).unwrap()
    } catch (error) {
      console.log(
        'Error deleting posts-list-section-post [src/common/pages/posts-page/layout/posts-page-posts-list-section/ui/posts-list-section-post/layout/posts-list-section-post-actions-block/index.tsx] PostActionsBlock:',
        error
      )
    }
  }

  return (
    <div className='absolute right-4 top-4 flex flex-col items-center gap-2'>
      {/*View image*/}
      <PostImageIcon
        isPostImage={isPostImage}
        toggle={toggle}
        isLoadingDeletingPost={isLoadingDeletingPost}
      />

      {/* Delete icon */}
      <DeletePostIcon
        postId={postId}
        handleDelete={handleDelete}
        isLoadingDeletingPost={isLoadingDeletingPost}
      />
    </div>
  )
}
