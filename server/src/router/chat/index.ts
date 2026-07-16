import { Router } from 'express'
import prisma from '../../db/prisma'
import authenticateToken from '../../middleware/authenticate-token'
import { wsService } from '../../app'
import { createImgInBucket } from '../../lib/s3-bucket/utils/create-img'
import { uploadImageMulter } from '../../middleware/upload-image-multer'

const router = Router()

/**
 * @swagger
 * /api/chat:
 *   get:
 *     summary: Получить или создать новый чат с пользователем. Требует аутентификации
 *     description: Получение в response данных чата или регистрация нового чата с пользователем, если чата нет
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: number
 *         description: ID пользователя для создания/получения чата
 *     responses:
 *       200:
 *         description: Чат успешно найден или создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *             example:
 *              createdAt: 2024-09-12T11:15:22.891Z
 *              id: 35ede-78e0-4d85-b9bb-9ce381741fbb
 *              lastMessage: null
 *              members: []
 *              type: DIRECT
 *              updatedAt: 2024-09-12T11:15:22.891Z
 *       400:
 *         description: Неверный или отсутствующий targetUserId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              error: targetUserId is required and must be a number
 *       401:
 *         description: Пользователь не аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: User is not authenticated
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.get('/chat', authenticateToken, async (req, res) => {
  const userId = req.user?.userId
  const targetUserId = req.query?.targetUserId

  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  if (targetUserId === '0' || isNaN(Number(targetUserId))) {
    res.status(400).json({ error: 'targetUserId is required and must be a number' })
    return
  }

  const parsedTargetId = Number(targetUserId)

  try {
    // 1. Найти DIRECT-чат между пользователями
    let chat = await prisma.chat.findFirst({
      where: {
        type: 'DIRECT',
        members: {
          every: {
            userId: { in: [Number(userId), parsedTargetId] }
          }
        }
      },
      include: {
        messages: {
          include: {
            sender: { select: { id: true, name: true, avatar: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    // 2. Если чата нет — создать
    if (!chat) {
      const chatId = crypto.randomUUID()
      await prisma.chat.create({
        data: {
          id: chatId,
          type: 'DIRECT',
          members: {
            create: [{ userId: Number(userId) }, { userId: parsedTargetId }]
          }
        }
      })

      // Получаем созданный чат с сообщениями
      chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          messages: {
            include: {
              sender: { select: { id: true, name: true, avatar: true } }
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      })
    }

    res.json(chat)
  } catch (error) {
    console.log('Error loading direct chat [src/router/chat/index.ts] /chat:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/chat/message:
 *   post:
 *     summary: Отправить текстовое сообщение в чат. Требует аутентификации
 *     description: Отправить текстовое сообщение в чат, в body {chatId и content}, валидация выполнена на клиенте
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *             type: object
 *             required: [chatId, content]
 *             properties:
 *               chatId:
 *                 type: string
 *                 example: Chat ID
 *                 description: Чат ID
 *               content:
 *                 type: string
 *                 example: Content of my new message in chat
 *                 description: Содержание сообщения
 *     responses:
 *       201:
 *         description: Сообщение успешно отправлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *              chatId: 35ede-78e0-4d85-b9bb-9ce381741fbb
 *              content: Hello, world!
 *              createdAt: 2024-09-12T11:15:22.891Z
 *              id: 35ede-78e0-4d85-b9bb-9ce381741fbb
 *              imageUrl: null
 *              isRead: false
 *              sender:
 *                 id: 1
 *                 name: John Doe
 *                 avatar: null
 *              senderId: 1
 *       400:
 *         description: Неверный или отсутствующий chatId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              error: chatId are required
 *       403:
 *         description: Проверяем что пользователь состоит в чате
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              error: You are not a member of this chat
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.post('/chat/message', authenticateToken, async (req, res) => {
  const { chatId, content } = req.body
  const senderId = req.user?.userId

  if (!chatId) {
    res.status(400).json({ error: 'chatId are required' })
    return
  }

  if (!senderId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    // Проверяем, существует ли чат и является ли пользователь участником
    const member = await prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: Number(senderId)
        }
      }
    })

    if (!member) {
      res.status(403).json({ error: 'You are not a member of this chat' })
      return
    }

    // Создаём новое сообщение
    const message = await prisma.message.create({
      data: {
        id: crypto.randomUUID(),
        content: content.trim(),
        senderId: Number(senderId),
        chatId: chatId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Обновляем последнее сообщение в чате
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessage: content.trim() }
    })

    wsService.getNotificationService().notify('CHAT_MESSAGE', { message: message })

    console.log(`📨 Message sent by user ${senderId} in chat ${chatId}:`, content.trim())

    // Возвращаем сообщение клиенту
    res.status(201).json(message)
  } catch (error) {
    console.log('Error sending message in chat [src/router/chat/index.ts] /chat/message:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/chat/image:
 *   post:
 *     summary: Отправить изображение в чат. Требует аутентификации
 *     description: Отправить изображение в чат с помощью `multipart/form-data` и получить в `response` URL загруженного изображения.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - file
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: Уникальный ID чата
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Изображение для загрузки
 *     responses:
 *       201:
 *         description: Изображение успешно отправлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               chatId: "1234567890"
 *               content: ""
 *               senderId: 1
 *               id: "1234567890"
 *               imageUrl: "https://storage.yandexcloud.net/project-chat/chat-images/f324a501-21e3-4464-9a65-29c7ac46f585-Снимокэкрана2025-07-29в09.42.26.png"
 *               isRead: false
 *               sender:
 *                 id: 1
 *                 name: "John Doe"
 *                 avatar: null
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Проверяем передан ли File и chatId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              error: File is required or chatId is required
 *       401:
 *         description: Пользователь не аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "User is not authenticated"
 *       403:
 *         description: Проверяем что пользователь состоит в чате
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              error: You are not a member of this chat
 *       404:
 *         description: Ошибка при загрузке изображения в S3
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *              error: Error uploading image to S3
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.post('/chat/image', uploadImageMulter.single('file'), authenticateToken, async (req, res) => {
  const { chatId } = req.body
  const imageFile = req?.file
  const senderId = req.user?.userId

  if (!chatId) {
    res.status(400).json({ error: 'chatId is required' })
    return
  }

  if (!imageFile) {
    res.status(400).json({ error: 'File is required' })
    return
  }

  if (!senderId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    // Проверяем, состоит ли пользователь в чате
    await prisma.chatMember.findUnique({
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: Number(senderId)
        }
      }
    })

    let imageUrl = null
    if (imageFile) {
      const s3Result = await createImgInBucket('chat-images', imageFile)

      if (s3Result.resCode !== 200) {
        console.log('Error uploading image to S3 [src/router/chat/index.ts] /chat/image:', s3Result.error)
        res.status(404).json({
          error: 'Error uploading image to S3'
        })
        return
      }

      imageUrl = s3Result.url
    }

    // Создаём сообщение на изображение
    const message = await prisma.message.create({
      data: {
        id: crypto.randomUUID(),
        content: null,
        imageUrl: imageUrl,
        senderId: Number(senderId),
        chatId: chatId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Обновляем lastMessage в чате
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessage: '📸 Фото' }
    })

    // Уведомляем через WebSocket
    wsService.getNotificationService().notify('CHAT_MESSAGE', { message })

    console.log(`📸 Image sent by user ${senderId} in chat ${chatId}: ${imageUrl}`)

    res.status(201).json(message)
  } catch (error) {
    console.log('Error uploading image [src/router/chat/index.ts] /chat/image:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/chat/unread:
 *   get:
 *     summary: Получить количество непрочитанных сообщений. Требует аутентификации
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Количество непрочитанных сообщений
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Ошибка сервера
 */
router.get('/chat/unread', authenticateToken, async (req, res) => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    const counts = await prisma.message.groupBy({
      by: ['senderId'],
      where: {
        senderId: { not: Number(userId) },
        isRead: false,
        chat: {
          members: {
            some: { userId: Number(userId) }
          }
        }
      },
      _count: { id: true }
    })

    const bySender = counts.map(c => ({ senderId: c.senderId, count: c._count.id }))
    const totalCount = bySender.reduce((sum, s) => sum + s.count, 0)

    res.json({ totalCount, bySender })
  } catch (error) {
    console.log('Error fetching unread counts [src/router/chat/index.ts] /chat/unread:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/chat/read/{chatId}:
 *   put:
 *     summary: Пометить сообщения в чате как прочитанные. Требует аутентификации
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Сообщения помечены как прочитанные
 *       401:
 *         description: Пользователь не аутентифицирован
 *       500:
 *         description: Ошибка сервера
 */
router.put('/chat/read/:chatId', authenticateToken, async (req, res) => {
  const userId = req.user?.userId
  const { chatId } = req.params

  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    const result = await prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: Number(userId) },
        isRead: false
      },
      data: { isRead: true }
    })

    res.json({ updated: result.count })
  } catch (error) {
    console.log('Error marking messages as read [src/router/chat/index.ts] /chat/read:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

export default router
