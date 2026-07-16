'use client'
import { useState } from 'react'
import { useMeQuery } from '@/features/auth/api'
import { SidebarHeader, SidebarSearchUserInputBlock, SidebarUsersListBlock } from './layout'

export const ChatPageSidebar = () => {
  const { data: user } = useMeQuery()
  const [searchTerm, setSearchTerm] = useState('')

  if (!user) return null

  return (
    <div className='flex w-80 flex-col border-r border-[#2a2a2b] bg-[#222222]'>
      {/* Header */}
      <SidebarHeader />
      {/* Search */}
      <SidebarSearchUserInputBlock searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Users List */}
      <SidebarUsersListBlock searchTerm={searchTerm} currentUserId={user.id} />
    </div>
  )
}
