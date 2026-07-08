'use server'
import { cookies } from 'next/headers'

export const getCookieUtil = async (name: string) => {
  const cookieStore = await cookies()
  if (cookieStore.has(name)) {
    try {
      return cookieStore.get(name)?.value
    } catch (error) {
      console.log(
        'Error reading cookie [src/common/utils/get-cookie-util/index.ts] function getCookieUtil:',
        error
      )
    }
  }
  return undefined
}
