import type { SOCKET_EVENTS } from '@/common/constants'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const getSocket = <T extends Record<string, unknown>>(query: T): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_EXPRESS_URL_WS + 'WS', {
      transports: ['websocket'],
      reconnectionDelayMax: 1000,
      query
    })

    socket.on('connect', () => console.log('✅ Connected to server'))
    socket.on('disconnect', (reason, description) =>
      console.log('❌ Disconnected from server: ', reason, description)
    )
    socket.on('connect_error', error => {
      console.log('Connection error:', error)
    })
  }
  return socket
}

type Callback<T> = (data: T) => void

export const subscribeToEvent = <T, Q extends Record<string, unknown>>(
  event: SOCKET_EVENTS,
  callback: Callback<T>,
  query: Q
) => {
  const socket: Socket = getSocket(query)
  socket.on(event, callback)

  return () => {
    socket.off(event, callback)
  }
}
