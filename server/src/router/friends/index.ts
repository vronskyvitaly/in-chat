import express from 'express'
import prisma from '../../db/prisma'
import authenticateToken from '../../middleware/authenticate-token'
import { wsService } from '../../app'

const router = express.Router()

// Публичные поля пользователя (без пароля)
const userSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  isOnline: true,
  status: true,
  city: true,
  lastSeen: true
} as const

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Дружба и заявки в друзья
 */

/** Список принятых друзей текущего пользователя */
router.get('/friends', authenticateToken, async (req, res): Promise<void> => {
  const userId = Number(req.user?.userId)
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  try {
    const rows = await prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }]
      },
      include: { requester: { select: userSelect }, addressee: { select: userSelect } },
      orderBy: { updatedAt: 'desc' }
    })
    // Возвращаем «другого» участника связи
    const friends = rows.map(r => (r.requesterId === userId ? r.addressee : r.requester))
    res.status(200).json(friends)
  } catch (error) {
    console.log('Error [friends] GET /friends:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/** Список друзей конкретного пользователя (публичный) */
router.get('/friends/user/:userId', authenticateToken, async (req, res): Promise<void> => {
  const targetId = Number(req.params.userId)
  if (!targetId) {
    res.status(400).json({ error: 'Invalid user id' })
    return
  }
  try {
    const rows = await prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: targetId }, { addresseeId: targetId }]
      },
      include: { requester: { select: userSelect }, addressee: { select: userSelect } },
      orderBy: { updatedAt: 'desc' }
    })
    const friends = rows.map(r => (r.requesterId === targetId ? r.addressee : r.requester))
    res.status(200).json(friends)
  } catch (error) {
    console.log('Error [friends] GET /friends/user/:userId:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/** Входящие заявки (мне прислали, ожидают ответа) */
router.get('/friends/requests/incoming', authenticateToken, async (req, res): Promise<void> => {
  const userId = Number(req.user?.userId)
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  try {
    const rows = await prisma.friendship.findMany({
      where: { addresseeId: userId, status: 'PENDING' },
      include: { requester: { select: userSelect } },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(rows.map(r => r.requester))
  } catch (error) {
    console.log('Error [friends] GET /friends/requests/incoming:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/** Исходящие заявки (я отправил, ожидают ответа) */
router.get('/friends/requests/outgoing', authenticateToken, async (req, res): Promise<void> => {
  const userId = Number(req.user?.userId)
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  try {
    const rows = await prisma.friendship.findMany({
      where: { requesterId: userId, status: 'PENDING' },
      include: { addressee: { select: userSelect } },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(rows.map(r => r.addressee))
  } catch (error) {
    console.log('Error [friends] GET /friends/requests/outgoing:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/** Возможные друзья: пользователи без связи со мной */
router.get('/friends/suggestions', authenticateToken, async (req, res): Promise<void> => {
  const userId = Number(req.user?.userId)
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  try {
    const related = await prisma.friendship.findMany({
      where: { OR: [{ requesterId: userId }, { addresseeId: userId }] },
      select: { requesterId: true, addresseeId: true }
    })
    const excludeIds = new Set<number>([userId])
    related.forEach(r => {
      excludeIds.add(r.requesterId)
      excludeIds.add(r.addresseeId)
    })
    const suggestions = await prisma.user.findMany({
      where: { id: { notIn: Array.from(excludeIds) } },
      select: userSelect,
      take: 10,
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(suggestions)
  } catch (error) {
    console.log('Error [friends] GET /friends/suggestions:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/** Отправить заявку в друзья (если встречная заявка уже есть — сразу принять) */
router.post('/friends/request/:userId', authenticateToken, async (req, res): Promise<void> => {
  const userId = Number(req.user?.userId)
  const targetId = Number(req.params.userId)
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  if (!targetId || targetId === userId) {
    res.status(400).json({ error: 'Invalid target user' })
    return
  }
  try {
    // Встречная заявка от целевого пользователя → принимаем
    const reverse = await prisma.friendship.findUnique({
      where: { requesterId_addresseeId: { requesterId: targetId, addresseeId: userId } }
    })
    if (reverse) {
      const updated = await prisma.friendship.update({
        where: { id: reverse.id },
        data: { status: 'ACCEPTED' }
      })
      wsService.getNotificationService().notify('FRIEND_REQUEST_ACCEPTED', {
        requesterId: targetId,
        addresseeId: userId
      })
      res.status(200).json({ status: updated.status })
      return
    }
    const friendship = await prisma.friendship.upsert({
      where: { requesterId_addresseeId: { requesterId: userId, addresseeId: targetId } },
      update: {},
      create: { requesterId: userId, addresseeId: targetId, status: 'PENDING' }
    })
    wsService.getNotificationService().notify('FRIEND_REQUEST_SENT', {
      requesterId: userId,
      addresseeId: targetId
    })
    res.status(201).json({ status: friendship.status })
  } catch (error) {
    console.log('Error [friends] POST /friends/request:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/** Принять входящую заявку от userId */
router.post('/friends/accept/:userId', authenticateToken, async (req, res): Promise<void> => {
  const userId = Number(req.user?.userId)
  const targetId = Number(req.params.userId)
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  try {
    const request = await prisma.friendship.findUnique({
      where: { requesterId_addresseeId: { requesterId: targetId, addresseeId: userId } }
    })
    if (!request || request.status !== 'PENDING') {
      res.status(404).json({ error: 'Friend request not found' })
      return
    }
    await prisma.friendship.update({ where: { id: request.id }, data: { status: 'ACCEPTED' } })
    wsService.getNotificationService().notify('FRIEND_REQUEST_ACCEPTED', {
      requesterId: targetId,
      addresseeId: userId
    })
    res.status(200).json({ status: 'ACCEPTED' })
  } catch (error) {
    console.log('Error [friends] POST /friends/accept:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/** Отклонить входящую заявку / удалить из друзей / отменить исходящую */
router.delete('/friends/:userId', authenticateToken, async (req, res): Promise<void> => {
  const userId = Number(req.user?.userId)
  const targetId = Number(req.params.userId)
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  try {
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { requesterId: userId, addresseeId: targetId },
          { requesterId: targetId, addresseeId: userId }
        ]
      }
    })
    wsService.getNotificationService().notify('FRIEND_REMOVED', {
      userId,
      targetId
    })
    res.status(200).json({ message: 'Removed' })
  } catch (error) {
    console.log('Error [friends] DELETE /friends:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

export default router
