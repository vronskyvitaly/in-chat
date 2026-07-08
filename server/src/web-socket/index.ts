import { Namespace, Server } from 'socket.io'
import { UserService } from './services/user-service'
import { NotificationService } from './services/notification-service'
import { AuthService } from './services/auth-service'

let instance: WSService | null = null

export class WSService {
  readonly userService: UserService
  readonly notificationService: NotificationService
  readonly nsp: Namespace

  constructor(private io: Server) {
    this.nsp = this.io.of('/WS')
    this.userService = new UserService()
    this.notificationService = new NotificationService(this.nsp)

    // ✅ Установка обработчика подключения
    this.setupConnectionHandler()
  }

  /**
   * @private
   * @Info Connection websocket
   */
  private setupConnectionHandler() {
    this.nsp.on('connection', async socket => {
      console.log('✅ Client connected:', socket.id)

      // Логирование ошибок сокета
      this.io.on('error', (err: any) => {
        console.error(`⚠️ Socket ${socket.id} error:`, err)
      })

      const user = await AuthService.getUserFromSocket(socket)

      // ✅ Проверка наличия пользователя
      if (!user) {
        socket.disconnect(true)
        return
      }

      // ✅ Меняем статус пользователя как online
      await this.userService.onUserConnected(socket.id, user.id)

      // ✅ Ловим отключение
      socket.on('disconnect', async () => {
        console.log(`🔌 Socket ${socket.id} disconnected`)

        // ✅ Меняем статус пользователя как offline
        await this.userService.onUserDisconnected(user.id)
      })
    })
  }

  getNotificationService() {
    return this.notificationService
  }

  // Singleton (опционально)
  static getInstance(io?: Server): WSService {
    if (!instance && io) {
      instance = new WSService(io)
    }
    return instance!
  }
}
