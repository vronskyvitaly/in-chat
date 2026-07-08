import { useMemo } from 'react'
import type { TUser } from '@/features/users/types'

export const useFilteredUsers = (users: TUser[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm) return users

    return users.filter(
      user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])
}
