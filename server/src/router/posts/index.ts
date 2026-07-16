import express from 'express'
import authenticateToken from '../../middleware/authenticate-token'
import prisma from '../../db/prisma'
import { wsService } from '../../app'
import { createImgInBucket } from '../../lib/s3-bucket/utils/create-img'
import { uploadImageMulter } from '../../middleware/upload-image-multer'
import { deleteImageFromBucket } from '../../lib/s3-bucket/utils/delete-img'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: My First Post
 *         content:
 *           type: string
 *           example: This is the content of my first post
 *         authorId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           example: My New Post
 *         content:
 *           type: string
 *           example: Content of the new post
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error message
 *         error:
 *           type: string
 *           example: Detailed error description
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API для управления постами
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Получить все посты
 *     description: Получить массив всех постов. Требует аутентификации.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает массив постов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *             example:
 *               - id: 1
 *                 title: "First Post"
 *                 content: "Content of first post"
 *                 authorId: 1
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *                 updatedAt: "2023-01-01T00:00:00.000Z"
 *               - id: 2
 *                 title: "Second Post"
 *                 content: "Content of second post"
 *                 authorId: 2
 *                 createdAt: "2023-01-02T00:00:00.000Z"
 *                 updatedAt: "2023-01-02T00:00:00.000Z"
 *       401:
 *         description: Пользователь не аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: User is not authenticated
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.get('/posts', authenticateToken, async (req, res): Promise<any> => {
  const userId = req.user?.userId
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: +userId }, select: { id: true } }
      }
    })
    // Плоский вид: автор + likesCount + likedByMe + commentsCount
    const mapped = posts.map(({ _count, likes, ...post }) => ({
      ...post,
      likesCount: _count.likes,
      likedByMe: likes.length > 0,
      commentsCount: _count.comments
    }))
    res.status(200).json(mapped)
  } catch (error) {
    console.log('Error [src/router/posts/index.ts ] /posts:', error)
    res.status(500).send({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/posts/get-user-posts:
 *   get:
 *     summary: Получить посты текущего пользователя
 *     description: Получить массив постов пользователя по ID. Требует аутентификации
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает массив постов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *             example:
 *               - id: 1
 *                 title: "My Post"
 *                 content: "Content of my post"
 *                 authorId: 1
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *                 updatedAt: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: Пользователь не аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "User is not authenticated"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
// GET /api/posts/user/:userId — посты конкретного пользователя (с автором)
router.get('/posts/user/:userId', authenticateToken, async (req, res): Promise<void> => {
  const targetUserId = parseInt(req.params.userId, 10)
  const currentUserId = req.user?.userId

  if (!currentUserId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: targetUserId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: +currentUserId }, select: { id: true } }
      }
    })
    const mapped = posts.map(({ _count, likes, ...post }) => ({
      ...post,
      likesCount: _count.likes,
      likedByMe: likes.length > 0,
      commentsCount: _count.comments
    }))
    res.status(200).json(mapped)
  } catch (error) {
    console.log('Error [posts] GET /posts/user/:userId:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

router.get('/posts/get-user-posts', authenticateToken, async (req, res) => {
  const userId = req?.user?.userId

  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  try {
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: +userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: +userId }, select: { id: true } }
      }
    })
    // Приводим к плоскому виду: likesCount + likedByMe + commentsCount
    const mapped = userPosts.map(({ _count, likes, ...post }) => ({
      ...post,
      likesCount: _count.likes,
      likedByMe: likes.length > 0,
      commentsCount: _count.comments
    }))
    res.status(200).json(mapped)
  } catch (error) {
    console.log('Error [src/router/posts/index.ts] /posts/get-user-posts:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/posts/add-post:
 *   post:
 *     summary: Создать новый пост (с опциональным изображением)
 *     description: Создать новый пост. Можно прикрепить (опционально) изображение c помощью `multipart/form-data`. Валидация `title` и `content` происходит но клиенте. Требует аутентификации
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: My New Post
 *                 description: Заголовок поста
 *               content:
 *                 type: string
 *                 example: Content of my new post
 *                 description: Основной текст поста
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Изображение поста (опционально)
 *           encoding:
 *             image:
 *               contentType: image/jpeg, image/png, image/gif
 *     responses:
 *       201:
 *         description: Пост успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *             example:
 *               id: 3
 *               title: "My New Post"
 *               content: "Content of my new post"
 *               authorId: 1
 *               imageUrl: "https://s3.example.com/posts-test/abc123.jpg"
 *               createdAt: "2023-01-03T00:00:00.000Z"
 *               updatedAt: "2023-01-03T00:00:00.000Z"
 *       400:
 *         description: Ошибка валидации или загрузки изображения
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to upload image"
 *       401:
 *         description: Пользователь не аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: User is not authenticated
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.post(
  '/posts/add-post',
  uploadImageMulter.single('image'),
  authenticateToken,
  async (req, res): Promise<void> => {
    const { title, content } = req.body
    const userId = req.user?.userId
    const imageFile = req?.file

    if (!userId) {
      res.status(401).json({
        error: 'User is not authenticated'
      })
      return
    }

    try {
      let imageUrl = null
      if (imageFile) {
        const s3Result = await createImgInBucket('post-images', imageFile)

        if (s3Result.resCode !== 200) {
          res.status(400).json({
            error: s3Result.error || 'Failed to upload image'
          })
          return
        }

        imageUrl = s3Result.url
        console.log('Image URL from S3:', imageUrl)
      }

      const newPost = await prisma.post.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          authorId: +userId,
          ...(imageUrl && { imageUrl })
        }
      })

      wsService.getNotificationService().notify('POST_CREATED', {
        message: 'New post created',
        post: newPost,
        timestamp: new Date()
      })

      res.status(201).json({
        success: true,
        data: newPost,
        message: 'Post created successfully'
      })
    } catch (error) {
      console.log('Error creating post [src/router/posts/index.ts] /posts/add-post:', error)
      res.status(500).json({ error: 'Error on the server, more details in the terminal' })
    }
  }
)

/**
 * @swagger
 * /api/posts/delete-post/{postId}:
 *   delete:
 *     summary: Удалить пост по ID
 *     description: Удалить пост по его идентификатору переданному в параметрах. Требует аутентификации.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID поста для удаления
 *         schema:
 *           type: integer
 *           format: int64
 *         example: 1
 *     responses:
 *       200:
 *         description: Пост успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *             example:
 *               id: 1
 *               title: "Post title"
 *               content: "Content of deleted post"
 *               authorId: 1
 *               createdAt: "2023-01-01T00:00:00.000Z"
 *               updatedAt: "2023-01-01T00:00:00.000Z"
 *       400:
 *         description: Не указан ID поста
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Post id is required"
 *       401:
 *         description: Пользователь не аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: User is not authenticated
 *       404:
 *         description: Ошибка при удалении изображения из S3
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Error on the server, more details in the terminal
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.delete('/posts/delete-post/:postId', authenticateToken, async (req, res) => {
  const postId = parseInt(req.params.postId, 10)
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }

  if (!postId) {
    res.status(400).json({ error: 'Post id is required' })
    return
  }

  try {
    const deletedPost = await prisma.post.delete({
      where: {
        id: +postId
      }
    })

    if (deletedPost.imageUrl) {
      try {
        await deleteImageFromBucket({
          urlOldPhotoPath: deletedPost.imageUrl,
          bucketName: process.env.S3_BASKET_NAME as string,
          folderPath: 'post-images'
        })
      } catch (error) {
        console.log(
          'Error deleting image from S3 [src/router/posts/index.ts] /posts/delete-post/:postId:',
          error
        )
        res.status(404).send({ error: 'Error on the server, more details in the terminal' })
        return
      }
    }

    wsService.getNotificationService().notify('POST_DELETED', { postId: +postId })

    res.status(200).json(deletedPost)
  } catch (error) {
    console.log('Error delete-post [src/router/posts/index.ts] /posts/delete-post/:postId:', error)
    res.status(500).send({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   post:
 *     summary: Поставить/снять лайк на пост (переключатель)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.post('/posts/:postId/like', authenticateToken, async (req, res): Promise<void> => {
  const postId = Number(req.params.postId)
  const userId = req.user?.userId
  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  try {
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId: +userId } }
    })
    let liked: boolean
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      liked = false
    } else {
      await prisma.like.create({ data: { postId, userId: +userId } })
      liked = true
    }
    const likesCount = await prisma.like.count({ where: { postId } })

    wsService.getNotificationService().notify('POST_LIKED', {
      postId,
      liked,
      likesCount,
      userId: +userId
    })

    res.status(200).json({ liked, likesCount })
  } catch (error) {
    console.log('Error [posts] POST /posts/:postId/like:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

// Публичные поля автора комментария
const commentAuthorSelect = { id: true, name: true, avatar: true } as const

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: Получить комментарии поста
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.get('/posts/:postId/comments', authenticateToken, async (req, res): Promise<void> => {
  const postId = Number(req.params.postId)
  if (!req.user) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { author: { select: commentAuthorSelect } },
      orderBy: { createdAt: 'asc' }
    })
    res.status(200).json(comments)
  } catch (error) {
    console.log('Error [posts] GET /posts/:postId/comments:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Добавить комментарий к посту
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.post('/posts/:postId/comments', authenticateToken, async (req, res): Promise<void> => {
  const postId = Number(req.params.postId)
  const userId = req.user?.userId
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : ''

  if (!userId) {
    res.status(401).json({ error: 'User is not authenticated' })
    return
  }
  if (!content) {
    res.status(400).json({ error: 'Комментарий не может быть пустым' })
    return
  }
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) {
      res.status(404).json({ error: 'Пост не найден' })
      return
    }
    const comment = await prisma.comment.create({
      data: { content, postId, authorId: +userId },
      include: { author: { select: commentAuthorSelect } }
    })

    wsService.getNotificationService().notify('COMMENT_CREATED', {
      postId,
      comment
    })

    res.status(201).json(comment)
  } catch (error) {
    console.log('Error [posts] POST /posts/:postId/comments:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

export default router
