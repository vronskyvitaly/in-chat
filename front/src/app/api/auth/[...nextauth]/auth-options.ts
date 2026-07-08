import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

interface UserSession {
  id: string
  isAdmin?: boolean
  name: string
  email: string
  createAt: string
  updateAt: string
}

type ResponseUser = Pick<UserSession, 'id' | 'email' | 'name'> & { accessToken: string; refreshToken: string }

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: 'sign-in'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null
          // User authorization without middleware
          const res = await axios.post(`${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/auth/sign-in`, {
            email: credentials?.email,
            password: credentials?.password
          })

          if (res) {
            return res.data
          }
        } catch (error) {
          console.log('Error [src/app/api/auth/[...nextauth]/auth-options.ts] authorize function', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      try {
        // We receive user data by email without middleware
        const res = await axios.get<undefined, { data: UserSession }>(
          `${process.env.NEXT_PUBLIC_EXPRESS_SERVER}api/users/by-email/${session?.user?.email}`
        )

        if (res.data !== undefined) {
          return {
            ...session,
            user: {
              ...session.user,
              name: res?.data?.name,
              id: res?.data?.id,
              isAdmin: res?.data?.isAdmin || false // Указываем значение по умолчанию
            }
          }
        } else {
          return session
        }
      } catch (error) {
        console.log(
          'Error fetching user data [src/app/api/auth/[...nextauth]/auth-options.ts] session function:',
          error
        )
        return session
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as ResponseUser).accessToken
        token.refreshToken = (user as ResponseUser).refreshToken
        token.id = (user as ResponseUser).id
        token.name = (user as ResponseUser).name
      }
      return token
    }
  },

  session: {
    // Set the number of days for the session
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    updateAge: 24 * 60 * 60 // Session update every 24 hours
  }
}
