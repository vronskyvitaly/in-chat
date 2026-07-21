'use client'
import { useState } from 'react'
import { useMeQuery } from '@/features/auth/api'
import { SidebarHeader, SidebarSearchUserInputBlock, SidebarUsersListBlock } from './layout'

export const ChatPageSidebar = () => {
  const { data: user } = useMeQuery()
  const [searchTerm, setSearchTerm] = useState('')

  if (!user) return null

  return (
    <div className='flex w-full flex-col bg-[#222222] sm:w-80 sm:border-r sm:border-[#2a2a2b]'>
      {/* Header */}
      <SidebarHeader userName={user.name} userAvatar={user.avatar} />
      {/* Search */}
      <SidebarSearchUserInputBlock searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Users List */}
      <SidebarUsersListBlock searchTerm={searchTerm} currentUserId={user.id} />
    </div>
  )
}
