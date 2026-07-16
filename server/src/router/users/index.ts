import express from 'express'
import prisma from '../../db/prisma'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error message
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *     DeleteUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User deleted successfully
 *         deletedUser:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: John Doe
 *             email:
 *               type: string
 *               example: john@example.com
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: securePassword123
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * /api/users/get-all:
 *   get:
 *     summary: Получить список всех пользователей
 *     description: Возвращает массив всех пользователей системы без паролей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает массив пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *             example:
 *               - id: 1
 *                 name: John Doe
 *                 email: john@example.com
 *                 createdAt: 2023-01-01T00:00:00.000Z
 *                 updatedAt: 2023-01-01T00:00:00.000Z
 *               - id: 2
 *                 name: Jane Smith
 *                 email: jane@example.com
 *                 createdAt: 2023-01-02T00:00:00.000Z
 *                 updatedAt: 2023-01-02T00:00:00.000Z
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.get('/users/get-all', async (_, res) => {
  try {
    const users = await prisma.user.findMany({
      omit: { password: true }
    })
    res.status(200).json(users)
  } catch (error) {
    console.log('Error get all users [src/router/users/index.ts] /users/get-all:', error)
    res.status(500).send({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/users/by-email/{email}:
 *   get:
 *     summary: Найти пользователя по email
 *     description: Возвращает информацию о пользователе по его email адресу
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email адрес пользователя
 *         schema:
 *           type: string
 *           format: email
 *         example: john@example.com
 *     responses:
 *       200:
 *         description: Пользователь найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               id: 1
 *               name: John Doe
 *               email: john@example.com
 *               createdAt: 2023-01-01T00:00:00.000Z
 *               updatedAt: 2023-01-01T00:00:00.000Z
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: User not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.get('/users/by-email/:email', async (req, res) => {
  const { email } = req.params

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      omit: { password: true }
    })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
    } else {
      // Возвращаем найденного пользователя
      res.status(200).json(user)
    }
  } catch (error) {
    console.log('Error get user by email [src/router/users/index.ts] /users/by-email/:email:', error)
    res.status(500).send({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/users/delete-user/{id}:
 *   delete:
 *     summary: Удалить пользователя по ID
 *     description: Удаляет пользователя из системы по его идентификатору
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пользователя для удаления
 *         schema:
 *           type: integer
 *           format: int64
 *         example: 1
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *             example:
 *               message: User deleted successfully
 *               deletedUser:
 *                 id: 1
 *                 name: John Doe
 *                 email: john@example.com
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: User not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
router.delete('/users/delete-user/:id', async (req, res) => {
  const { id } = req.params

  try {
    // Проверяем существование пользователя
    const existingUser = await prisma.user.findUnique({
      where: { id: +id }
    })

    if (!existingUser) {
      res.status(404).json({ message: 'User not found' })
    } else {
      // Удаляем пользователя
      await prisma.user.delete({
        where: { id: +id }
      })

      res.status(200).json({
        message: 'User deleted successfully',
        deletedUser: {
          id: existingUser!.id,
          name: existingUser!.name,
          email: existingUser!.email
        }
      })
    }
  } catch (error) {
    console.log('Error delete user by id [src/router/users/index.ts] /users/delete-user/:id:', error)
    res.status(500).send({ error: 'Error on the server, more details in the terminal' })
  }
})

router.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10)
  if (!id) {
    res.status(400).json({ error: 'Invalid user id' })
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true }
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(200).json(user)
    }
  } catch (error) {
    console.log('Error [users] GET /users/:id:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

export default router
