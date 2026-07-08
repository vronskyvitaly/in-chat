import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/app/api/_base-query-with-reauth'

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Posts', 'PostsUser', 'Users', 'User', 'Chat', 'Messages', 'Auth'],
  endpoints: () => ({})
})
