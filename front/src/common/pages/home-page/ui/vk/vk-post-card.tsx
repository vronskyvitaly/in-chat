'use client'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Image from 'next/image'
import {
  FiMoreHorizontal,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiPaperclip,
  FiCamera,
  FiSmile,
  FiTrash2,
  FiEdit2
} from 'react-icons/fi'
import type { TPost } from '@/features/posts/types'
import { formatTimeUtil } from '@/common/utils'
import { useMeQuery } from '@/features/auth/api'
import {
  useDeletePostMutation,
  useToggleLikeMutation,
  useUpdatePostMutation
} from '@/features/posts/api'
import { useGetCommentsQuery, useAddCommentMutation } from '@/features/comments/api'
import { VkAvatar } from './vk-avatar'

type Props = {
  post: TPost
  authorName: string
  authorAvatar?: string | null
}

export const VkPostCard = ({ post, authorName, authorAvatar }: Props) => {
  const [showComments, setShowComments] = useState(false)
  const [text, setText] = useState('')

  const { data: me } = useMeQuery()
  const { data: comments = [], isLoading } = useGetCommentsQuery(post.id, { skip: !showComments })
  const [addComment, { isLoading: isSending }] = useAddCommentMutation()
  const [toggleLike] = useToggleLikeMutation()
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()
  const [updatePost, { isLoading: isSaving }] = useUpdatePostMutation()

  const [isEditing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const [isMenuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Удалять можно только свои посты
  const isOwnPost = !!me && String(me.id) === String(post.authorId)

  useEffect(() => {
    if (!isMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isMenuOpen])

  const handleDelete = async () => {
    setMenuOpen(false)
    if (!window.confirm('Удалить запись?')) return
    try {
      await deletePost(post.id).unwrap()
    } catch (error) {
      console.log('Error deleting post [vk-post-card.tsx] VkPostCard:', error)
    }
  }

  const startEdit = () => {
    setMenuOpen(false)
    setDraft(post.content)
    setEditing(true)
  }

  const trimmedDraft = draft.trim()
  // Пост без картинки не может остаться пустым
  const canSave =
    !isSaving && trimmedDraft !== post.content && (!!trimmedDraft || !!post.imageUrl)

  const saveEdit = async () => {
    if (!canSave) return
    try {
      await updatePost({ postId: post.id, content: trimmedDraft }).unwrap()
      setEditing(false)
    } catch (error) {
      console.log('Error updating post [vk-post-card.tsx] VkPostCard:', error)
    }
  }

  const onEditKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') setEditing(false)
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      saveEdit()
    }
  }

  // В общей ленте автор приходит вместе с постом, в профиле — это текущий пользователь
  const displayName = post.author ? post.author.name : authorName
  const displayAvatar = post.author ? post.author.avatar : authorAvatar

  const submit = async () => {
    const content = text.trim()
    if (!content || isSending) return
    try {
      await addComment({ postId: post.id, content }).unwrap()
      setText('')
    } catch {
      /* тост не критичен здесь */
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <article className='rounded-xl border border-[#2a2a2b] bg-[#222222] p-4'>
      <header className='mb-2 flex items-center gap-3'>
        <VkAvatar name={displayName} src={displayAvatar} size={40} />
        <div className='min-w-0'>
          <p className='truncate font-medium text-[#e1e3e6]'>{displayName}</p>
          <p className='text-xs text-[#828282]'>{formatTimeUtil(post.createdAt, 'full')}</p>
        </div>
        {isOwnPost && (
          <div ref={menuRef} className='relative ml-auto'>
            <button
              onClick={() => setMenuOpen(v => !v)}
              disabled={isDeleting}
              className='text-[#828282] hover:text-[#e1e3e6] disabled:opacity-50'
            >
              <FiMoreHorizontal className='h-5 w-5' />
            </button>
            {isMenuOpen && (
              <div className='absolute right-0 top-full z-10 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-[#3a3a3b] bg-[#2a2a2b] py-1 shadow-lg'>
                <button
                  onClick={startEdit}
                  className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#e1e3e6] hover:bg-[#3a3a3b]'
                >
                  <FiEdit2 className='h-4 w-4' />
                  Редактировать
                </button>
                <button
                  onClick={handleDelete}
                  className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#e64646] hover:bg-[#3a3a3b]'
                >
                  <FiTrash2 className='h-4 w-4' />
                  Удалить запись
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {post.title && <h3 className='mb-1 font-semibold text-[#e1e3e6]'>{post.title}</h3>}
      {isEditing ? (
        <div className='space-y-2'>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={onEditKeyDown}
            autoFocus
            rows={3}
            placeholder='Описание записи'
            className='w-full resize-y rounded-lg border border-[#3a3a3b] bg-[#2a2a2b] px-3 py-2 text-[15px] leading-relaxed text-[#e1e3e6] placeholder:text-[#828282] focus:border-[#2688eb] focus:outline-none'
          />
          <div className='flex justify-end gap-2'>
            <button
              onClick={() => setEditing(false)}
              disabled={isSaving}
              className='rounded-lg px-3 py-1.5 text-sm text-[#e1e3e6] hover:bg-[#2a2a2b]'
            >
              Отмена
            </button>
            <button
              onClick={saveEdit}
              disabled={!canSave}
              className='rounded-lg bg-[#2688eb] px-3 py-1.5 text-sm text-white hover:bg-[#3a95ef] disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isSaving ? 'Сохранение…' : 'Сохранить'}
            </button>
          </div>
        </div>
      ) : (
        post.content && (
          <p className='whitespace-pre-line text-[15px] leading-relaxed text-[#dcdee0]'>{post.content}</p>
        )
      )}
      {post.imageUrl && (
        <div className='mt-3 overflow-hidden rounded-lg'>
          <Image
            src={post.imageUrl}
            alt={post.title || 'post'}
            width={640}
            height={400}
            className='h-auto w-full object-cover'
          />
        </div>
      )}

      <footer className='mt-3 flex items-center gap-0.5 border-t border-[#2a2a2b] pt-2 text-[#828282] sm:gap-1'>
        <button
          onClick={() => toggleLike(post.id)}
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[#2a2a2b] sm:gap-2 sm:px-3 ${
            post.likedByMe ? 'text-[#e64646]' : 'hover:text-[#e1e3e6]'
          }`}
        >
          <FiHeart className={`h-4 w-4 shrink-0 ${post.likedByMe ? 'fill-current' : ''}`} />
          <span className='hidden sm:inline'>Нравится</span>
          {!!post.likesCount && post.likesCount > 0 && (
            <span className={post.likedByMe ? 'text-[#e64646]' : 'text-[#828282]'}>
              {post.likesCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setShowComments(v => !v)}
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm hover:bg-[#2a2a2b] hover:text-[#e1e3e6] sm:gap-2 sm:px-3 ${
            showComments ? 'text-[#e1e3e6]' : ''
          }`}
        >
          <FiMessageSquare className='h-4 w-4 shrink-0' />
          <span className='hidden sm:inline'>Комментировать</span>
          {(post.commentsCount ?? 0) > 0 && (
            <span className='text-[#828282]'>{post.commentsCount}</span>
          )}
        </button>
        <button className='flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm hover:bg-[#2a2a2b] hover:text-[#e1e3e6] sm:gap-2 sm:px-3'>
          <FiShare2 className='h-4 w-4 shrink-0' />
          <span className='hidden sm:inline'>Поделиться</span>
        </button>
      </footer>

      {/* Секция комментариев */}
      {showComments && (
        <div className='mt-3 space-y-3 border-t border-[#2a2a2b] pt-3'>
          {isLoading ? (
            <p className='text-sm text-[#828282]'>Загрузка комментариев…</p>
          ) : comments.length > 0 ? (
            comments.map(c => (
              <div key={c.id} className='flex gap-2.5'>
                <VkAvatar name={c.author.name} src={c.author.avatar} size={34} />
                <div className='min-w-0 flex-1 rounded-2xl rounded-tl-md bg-[#2a2a2b] px-3 py-2'>
                  <p className='text-sm font-medium text-[#e1e3e6]'>{c.author.name}</p>
                  <p className='whitespace-pre-line break-words text-[15px] text-[#dcdee0]'>
                    {c.content}
                  </p>
                  <p className='mt-1 text-xs text-[#828282]'>
                    {formatTimeUtil(c.createdAt, 'datetime')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-sm text-[#828282]'>Пока нет комментариев. Будьте первым!</p>
          )}

          {/* Поле ввода комментария (стиль VK) */}
          <div className='flex items-center gap-2'>
            <div className='hidden sm:block'>
              <VkAvatar name={me?.name} src={me?.avatar} size={40} />
            </div>
            <div className='flex min-w-0 flex-1 items-center gap-1 rounded-2xl border border-[#3a3a3b] bg-[#2a2a2b] pl-3 pr-2 transition-colors focus-within:border-[#2688eb] sm:pl-4'>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder='Написать комментарий...'
                className='flex-1 bg-transparent py-2.5 text-[15px] text-[#e1e3e6] placeholder:text-[#828282] focus:outline-none'
              />
              <button
                type='button'
                title='Прикрепить файл'
                className='flex h-8 w-8 items-center justify-center rounded-full text-[#828282] transition-colors hover:bg-[#3a3a3b] hover:text-[#e1e3e6]'
              >
                <FiPaperclip className='h-[18px] w-[18px]' />
              </button>
              <button
                type='button'
                title='Фото'
                className='flex h-8 w-8 items-center justify-center rounded-full text-[#828282] transition-colors hover:bg-[#3a3a3b] hover:text-[#e1e3e6]'
              >
                <FiCamera className='h-[18px] w-[18px]' />
              </button>
              <button
                type='button'
                title='Эмодзи'
                onClick={() => setText(t => t + '🙂')}
                className='flex h-8 w-8 items-center justify-center rounded-full text-[#828282] transition-colors hover:bg-[#3a3a3b] hover:text-[#e1e3e6]'
              >
                <FiSmile className='h-[18px] w-[18px]' />
              </button>
            </div>
            <button
              onClick={submit}
              disabled={!text.trim() || isSending}
              title='Отправить'
              className='flex h-9 w-9 items-center justify-center rounded-full text-[#5b9bea] transition-colors hover:bg-[#2a2a2b] disabled:cursor-not-allowed disabled:text-[#4a4a4b] disabled:hover:bg-transparent'
            >
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 12h14M13 6l6 6-6 6' />
              </svg>
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
