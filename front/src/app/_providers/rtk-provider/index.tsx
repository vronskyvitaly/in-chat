'use client'
/**
 * @info authorization example
 * @video https://youtu.be/w2h54xz6Ndw?si=-l7NyF1xdWLS84S2
 * @gitHub https://github.com/gitdagray/next-auth-intro
 */
import { ReactNode } from 'react'
import { store } from '@/app/_store'
import { Provider } from 'react-redux'

export const RTKProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>
}
