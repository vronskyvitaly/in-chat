import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { cookies } from 'next/headers'
import { PATH } from '@/common/constants'

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!token) {
    return NextResponse.redirect(new URL(PATH.SING_IN, req.nextUrl))
  }

  const accessToken = token.accessToken as string
  const refreshToken = token.refreshToken as string

  const cookieStore = await cookies()
  cookieStore.set('accessToken', `${accessToken}`)
  cookieStore.set('refreshToken', `${refreshToken}`)
  cookieStore.set('userId', `${token.id}`)

  return NextResponse.next()
}

export const config = {
  matcher: ['/posts', '/', '/chat', '/profile', '/friends'] // Applies to routes specified in the array
}
