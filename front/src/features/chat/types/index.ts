export type TChatMessage = {
  chatId: string
  content: string
  imageUrl: string | null
  createdAt: string
  id: string
  isRead: boolean
  sender: {
    id: number
    name: string
    avatar: string | null
  }
  senderId: number
}

export type TResponseFetchUserChat = {
  id: string
  type: 'DIRECT'
  createdAt: string
  updatedAt: string
  lastMessage: string | null
  messages: TChatMessage[]
}
