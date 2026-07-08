'use client'
/**
 * @info authorization example
 * @video https://youtu.be/w2h54xz6Ndw?si=-l7NyF1xdWLS84S2
 * @gitHub https://github.com/gitdagray/next-auth-intro
 */
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <SessionProvider baseUrl={process.env.NEXT_PUBLIC_EXPRESS_SERVER}>{children}</SessionProvider>
}
