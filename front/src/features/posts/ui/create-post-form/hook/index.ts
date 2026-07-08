'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Альтернативный тип для react-hook-form
export type TCreatePostFormValues = {
  title: string
  content: string
  image?: FileList // или File[]
}

// Схема для react-hook-form
export const createPostSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  image: z.any().optional() // Для файлов используем z.any()
})

export const useCreatePostForm = () =>
  useForm<TCreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  })
