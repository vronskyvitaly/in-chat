import { z } from 'zod'
import { createPostSchema } from '@/features/posts/ui/create-post-form/hook'

export type TCreatePostValues = z.infer<typeof createPostSchema>
