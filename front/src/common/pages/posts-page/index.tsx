'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { LoadingFullScreen } from '@/common/components/ui'
import { useCreatePostMutation, useFetchPostsQuery } from '@/features/posts/api'
import { PostPageHeader, PostsPagePostsListSection } from './layout'
import { CreatePostForm, useCreatePostForm } from '@/features/posts/ui'

export default function PostsPage() {
  const { data: session, status } = useSession()
  const { data: posts = [], isLoading } = useFetchPostsQuery()
  const [createPostMutation, { isLoading: createPostIsLoading }] = useCreatePostMutation()
  const { reset } = useCreatePostForm()
  const [formKey, setFormKey] = useState(0)

  const onSubmit = async (data: FormData) => {
    try {
      await createPostMutation(data).unwrap()
      reset()
      setFormKey(prev => prev + 1)
    } catch (error) {
      console.log('Create posts-list-section-post [src/common/pages/posts-page/index.tsx] onSubmit', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return <LoadingFullScreen />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <main className='flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='w-full max-w-4xl mx-auto p-4'>
        {/* Header */}
        <PostPageHeader session={session} />

        {/* Create Post Form */}
        {/* INFO: Added forKey to clear the form after creating a post */}
        <CreatePostForm key={formKey} onSubmit={onSubmit} createPostIsLoading={createPostIsLoading} />

        {/* Posts List Section */}
        <PostsPagePostsListSection posts={posts} />
      </div>
    </main>
  )
}
