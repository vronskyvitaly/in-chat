import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { PATH } from '@/common/constants'
import { handleError } from '@/app/api/_handle-error'

const isBrowser = typeof window !== 'undefined'

/**
 * Getting a token from cookies
 */
const getAccessToken = (): string | null => {
  if (isBrowser) {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
  }
  return null
}

/**
 * Getting refresh token from cookies
 */
const getRefreshToken = (): string | null => {
  if (isBrowser) {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
  }
  return null
}

/**
 * Setting an access token in a cookie
 */
const setAccessToken = (token: string): void => {
  if (isBrowser) {
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 минут
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure; SameSite=Strict' : ''
    document.cookie = `accessToken=${token}; path=/; expires=${expires.toUTCString()}${secureFlag}`
  }
}

/**
 * Setting refresh token in cookie
 */
const setRefreshToken = (token: string): void => {
  if (isBrowser) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure; SameSite=Strict' : ''
    document.cookie = `refreshToken=${token}; path=/; expires=${expires.toUTCString()}${secureFlag}`
  }
}

/**
 * Removing tokens from cookies
 */
const clearTokens = (): void => {
  if (isBrowser) {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

const mutex = new Mutex()

/** Basic request with authorization */
const base = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_EXPRESS_SERVER,
  prepareHeaders: headers => {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    // RTK Query сам определяет Content-Type
    return headers
  },
  paramsSerializer: params => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          searchParams.append(key, String(item))
        })
      } else if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    })

    return searchParams.toString()
  }
})

/** Wrapper with refresh logic via cookies */
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // If someone already refreshes, we’re waiting.
  await mutex.waitForUnlock()

  // Main request
  let result = await base(args, api, extraOptions)

  handleError(result)

  // Handling 401 error (unauthorized)
  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
          console.warn('No refresh token available')
          // Redirect to the login page if there is no refresh token
          if (isBrowser) {
            clearTokens()
            window.location.href = PATH.SING_IN
          }
          return result
        }

        const refreshResult = await base(
          {
            url: 'api/auth/token/refresh',
            method: 'POST',
            body: { refreshToken }
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as {
            accessToken: string
            refreshToken: string
          }

          // We save new tokens in cookies
          setAccessToken(accessToken)
          if (newRefreshToken) {
            setRefreshToken(newRefreshToken)
          }

          // Retry the request with a new token
          result = await base(args, api, extraOptions)
        } else {
          // If the refresh is unsuccessful, clear the tokens and redirect to login
          console.log('Logout: refresh token invalid or expired')
          clearTokens()
          if (isBrowser) {
            window.location.href = PATH.SING_IN
          }
        }
      } catch (e) {
        console.error('Token refresh failed:', e)
        clearTokens()
        if (isBrowser) {
          window.location.href = PATH.SING_IN
        }
      } finally {
        release()
      }
    } else {
      // Waiting for another request to complete the refresh
      await mutex.waitForUnlock()
      result = await base(args, api, extraOptions)
    }
  }

  return result
}
