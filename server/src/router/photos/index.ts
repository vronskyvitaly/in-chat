import express from 'express'
import authenticateToken from '../../middleware/authenticate-token'
import prisma from '../../db/prisma'
import { createImgInBucket } from '../../lib/s3-bucket/utils/create-img'
import { deleteImageFromBucket } from '../../lib/s3-bucket/utils/delete-img'
import { uploadImageMulter } from '../../middleware/upload-image-multer'
import { wsService } from '../../app'

const commentAuthorSelect = { id: true, name: true, avatar: true } as const

const router = express.Router()

// GET /api/photos/user/:userId — фото конкретного пользователя
router.get('/photos/user/:userId', authenticateToken, async (req, res): Promise<void> => {
  const userId = parseInt(req.params.userId, 10)
  if (!userId) {
    res.status(400).json({ error: 'Invalid user id' })
    return
  }

  try {
    const photos = await prisma.photo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(photos)
  } catch (error) {
    console.log('Error [photos] GET /photos/user/:userId:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

// GET /api/photos — фото текущего пользователя
router.get('/photos', authenticateToken, async (req, res): Promise<void> => {
  const userId = req.user?.userId
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    const photos = await prisma.photo.findMany({
      where: { userId: +userId },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(photos)
  } catch (error) {
    console.log('Error [photos] GET /photos:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

// POST /api/photos/upload — загрузка до 10 фото
router.post(
  '/photos/upload',
  uploadImageMulter.array('photos', 10),
  authenticateToken,
  async (req, res): Promise<void> => {
    const userId = req.user?.userId
    if (!userId) {
      res.status(401).json({ error: 'User is not authenticated' })
      return
    }

    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files provided' })
      return
    }

    try {
      const created = []

      for (const file of files) {
        const s3Result = await createImgInBucket('user-photos', file)
        if (s3Result.resCode !== 200) {
          continue
        }
        const photo = await prisma.photo.create({
          data: {
            url: s3Result.url,
            userId: +userId
          }
        })
        created.push(photo)
      }

      res.status(201).json(created)
    } catch (error) {
      console.log('Error [photos] POST /photos/upload:', error)
      res.status(500).json({ error: 'Error on the server, more details in the terminal' })
    }
  }
)

// DELETE /api/photos/:photoId — удаление фото
router.delete('/photos/:photoId', authenticateToken, async (req, res): Promise<void> => {
  const userId = req.user?.userId
  const photoId = parseInt(req.params.photoId, 10)

  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  if (!photoId) {
    res.status(400).json({ error: 'Photo id is required' })
    return
  }

  try {
    const photo = await prisma.photo.findUnique({ where: { id: photoId } })

    if (!photo) {
      res.status(404).json({ error: 'Photo not found' })
      return
    }

    if (photo.userId !== +userId) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    await deleteImageFromBucket({
      urlOldPhotoPath: photo.url,
      bucketName: process.env.S3_BASKET_NAME as string,
      folderPath: 'user-photos'
    })

    await prisma.photo.delete({ where: { id: photoId } })

    res.status(200).json({ success: true })
  } catch (error) {
    console.log('Error [photos] DELETE /photos/:photoId:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

// GET /api/photos/:photoId/comments — комментарии к фото
router.get('/photos/:photoId/comments', authenticateToken, async (req, res): Promise<void> => {
  const photoId = parseInt(req.params.photoId, 10)
  if (!req.user) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    const comments = await prisma.photoComment.findMany({
      where: { photoId },
      include: { author: { select: commentAuthorSelect } },
      orderBy: { createdAt: 'asc' }
    })
    res.status(200).json(comments)
  } catch (error) {
    console.log('Error [photos] GET /photos/:photoId/comments:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

// POST /api/photos/:photoId/comments — добавить комментарий к фото
router.post('/photos/:photoId/comments', authenticateToken, async (req, res): Promise<void> => {
  const photoId = parseInt(req.params.photoId, 10)
  const userId = req.user?.userId
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : ''

  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  if (!content) {
    res.status(400).json({ error: 'Comment cannot be empty' })
    return
  }

  try {
    const photo = await prisma.photo.findUnique({ where: { id: photoId } })
    if (!photo) {
      res.status(404).json({ error: 'Photo not found' })
      return
    }

    const comment = await prisma.photoComment.create({
      data: { content, photoId, authorId: +userId },
      include: { author: { select: commentAuthorSelect } }
    })

    wsService.getNotificationService().notify('PHOTO_COMMENT_CREATED', {
      photoId,
      comment
    })

    res.status(201).json(comment)
  } catch (error) {
    console.log('Error [photos] POST /photos/:photoId/comments:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

export default router
