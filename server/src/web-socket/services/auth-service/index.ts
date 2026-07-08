import prisma from '../../../db/prisma'
import { Socket } from 'socket.io'

export class AuthService {
  static async getUserFromSocket(socket: Socket) {
    try {
      const socketQuery = socket.handshake.query

      if (!socketQuery) return null

      const { userId } = socketQuery

      if (!userId) return null

      return await prisma.user.findUnique({
        where: { id: +userId },
        select: { id: true, name: true, email: true, avatar: true }
      })
    } catch (error) {
      console.log(
        '❌ Error fetching user [src/web-socket/services/auth-service/index.ts] getUserFromSocket:',
        error
      )
      return null
    }
  }
}
