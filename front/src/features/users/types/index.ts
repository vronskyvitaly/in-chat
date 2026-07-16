export type TUser = {
  id: number
  name: string
  email: string
  avatar: string | null
  roomId: number | null
  isOnline: boolean
  lastSeen: string
  createdAt: string
  updatedAt: string
  status?: string | null
  city?: string | null
  maritalStatus?: string | null
  languages?: string[]
  coverUrl?: string | null
  coverColor?: string | null
}
