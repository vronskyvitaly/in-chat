import prisma from '../../../db/prisma'
import { wsService } from '../../../app'

interface IUser {
  socketId: string
  userId: number
  connectedAt: Date
}

export class UserService {
  private onlineUsers = new Map<number, IUser>()

  constructor() {}

  /**
   * @param socketId
   * @param userId
   * @info : Connected user
   */
  public async onUserConnected(socketId: string, userId: number) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: true, lastSeen: new Date() }
      })

      this.onlineUsers.set(userId, { socketId, userId, connectedAt: new Date() })

      wsService.getNotificationService().notify('USER_ONLINE', {
        user: await this.getUserData(userId),
        onlineCount: this.onlineUsers.size
      })

      console.log(`🟢 User ${userId} went online`)
    } catch (error) {
      console.log(
        'Error user connected [src/web-socket/services/user-service/index.ts] onUserConnected',
        error
      )
    }
  }

  /**
   * @param userId
   * @info : Disconnected user
   */
  public async onUserDisconnected(userId: number) {
    if (!this.onlineUsers.has(userId)) return

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false, lastSeen: new Date() },
        omit: { password: true }
      })

      this.onlineUsers.delete(userId)

      wsService.getNotificationService().notify('USER_OFFLINE', {
        user,
        onlineCount: this.onlineUsers.size
      })

      console.log(`🔴 User ${userId} went offline`)
    } catch (error) {
      console.log(
        'Error user disconnected [src/web-socket/services/user-service/index.ts] onUserDisconnected',
        error
      )
    }
  }

  public async getUserData(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, avatar: true, isOnline: true, lastSeen: true }
      })

      return user
    } catch (error) {
      console.log(
        'Error getting user data [src/web-socket/services/user-service/index.ts] getUserData',
        error
      )
      return null
    }
  }
}
