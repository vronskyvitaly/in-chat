import NextAuth from 'next-auth'
import { authOptions } from './auth-options'

/**
 * @info authorization example
 * @video https://youtu.be/w2h54xz6Ndw?si=-l7NyF1xdWLS84S2
 * @gitHub https://github.com/gitdagray/next-auth-intro
 */

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
