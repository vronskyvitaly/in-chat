import { SOCKET_EVENT_POSTS } from '@/features/posts/constants'
import { SOCKET_EVENT_USERS } from '@/features/users/constants'
import { SOCKET_EVENT_AUTH } from '@/features/auth/constants'
import { SOCKET_EVENT_CHAT } from '@/features/chat/constants'
import { SOCKET_EVENT_FRIENDS } from '@/features/friends/constants'
import { SOCKET_EVENT_PHOTOS } from '@/features/photos/constants'

export type SOCKET_EVENTS =
  | keyof typeof SOCKET_EVENT_POSTS
  | keyof typeof SOCKET_EVENT_USERS
  | keyof typeof SOCKET_EVENT_AUTH
  | keyof typeof SOCKET_EVENT_CHAT
  | keyof typeof SOCKET_EVENT_FRIENDS
  | keyof typeof SOCKET_EVENT_PHOTOS
