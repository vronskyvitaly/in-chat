import bcrypt from 'bcrypt'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../../db/prisma'
import authenticateToken from '../../middleware/authenticate-token'

const authorizationUserRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
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
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: securePassword123
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     LogoutRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     RegistrationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Пользователь зарегистрирован
 *         userId:
 *           type: integer
 *           example: 1
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: john@example.com
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     ErrorResponse:
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
 *   name: Authentication
 *   description: API для аутентификации и управления пользователями
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получение данных текущего пользователя
 *     description: Возвращает информацию о текущем аутентифицированном пользователе
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный запрос. Возвращает данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 image:
 *                   type: string
 *                   nullable: true
 *                   example: https://example.com/avatar.jpg
 *                 isOnline:
 *                   type: boolean
 *                   example: true
 *                 lastSeen:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:00Z
 *             example:
 *               id: 1
 *               name: John Doe
 *               email: john@example.com
 *               image: https://example.com/avatar.jpg
 *               isOnline: true
 *               lastSeen: 2024-01-15T10:30:00Z
 *       401:
 *         description: Пользователь не аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
authorizationUserRouter.get('/me', authenticateToken, async (req, res) => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({
      error: 'User is not authenticated'
    })
    return
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: +userId }, omit: { password: true } })
    res.status(200).json({
      ...user
    })
  } catch (error) {
    console.log('Error [src/router/auth/authorizationUserRouter.ts] authorizationUserRouter/me:', error)
    res.status(500).json({
      error: 'Error on the server, more details in the terminal'
    })
  }
})

/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создание учетной записи для нового пользователя, валидация данных выполняется на клиенте
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       description: Данные для регистрации пользователя
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *           example:
 *             name: John Doe
 *             email: john@example.com
 *             password: securePassword123
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *             example:
 *               message: User successfully registered
 *               userId: 1
 *       400:
 *         description: Пользователь с таким email уже зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: A user with this email is already registered
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
authorizationUserRouter.post('/sign-up', async (req, res): Promise<void> => {
  const { name, email, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      res.status(400).json({ message: 'A user with this email is already registered' })
      return
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)

      // Создаем нового пользователя
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
        omit: { password: true }
      })

      res.status(201).json({ message: 'User successfully registered', userId: user.id })
    }
  } catch (error) {
    console.log('Error [src/router/auth/authorizationUserRouter.ts] /sign-up:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: Вход пользователя в систему
 *     description: Аутентификация пользователя и ответ в response c access и refresh токенами
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       description: Учетные данные пользователя
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *           example:
 *             email: john@example.com
 *             password: securePassword123
 *     responses:
 *       200:
 *         description: Успешный вход в систему
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               id: 1
 *               email: john@example.com
 *       401:
 *         description: Неверный логин или пароль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Invalid login or password
 *       500:
 *         description: Ошибка при авторизации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
authorizationUserRouter.post('/sign-in', async (req, res): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid login or password' })
    } else {
      const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1m' })
      const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: '7d'
      })

      // Обновляем статус пользователя на "online"
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          isOnline: true,
          lastSeen: new Date()
        },
        omit: { password: true }
      })

      // Сохранение refresh токена в базе данных
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
      await prisma.userRefreshToken.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt
        }
      })

      res.json({
        accessToken,
        refreshToken,
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name
      })
    }
  } catch (error) {
    console.log('Error [src/router/auth/authorizationUserRouter.ts] authorizationUserRouter/login:', error)
    res.status(500).send({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/auth/token/refresh:
 *   post:
 *     summary: Обновление access токена
 *     description: Обновление токена, `response` содержит новый access токен, перезапрос происходит на клиенте в baseQueryWithReauth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       description: Refresh токен для обновления access токена
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *           example:
 *             refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Access токен успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *             example:
 *               accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       403:
 *         description: Недействительный refresh токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Недействительный refresh-токен
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
authorizationUserRouter.post('/token/refresh', async (req, res): Promise<void> => {
  const { refreshToken } = req.body

  try {
    const storedToken = await prisma.userRefreshToken.findFirst({
      where: { refreshToken }
    })

    if (!storedToken || new Date() > new Date(storedToken.expiresAt)) {
      res.status(403).json({ message: 'Invalid refresh token' })
    } else {
      const accessToken = jwt.sign({ userId: storedToken!.userId }, process.env.JWT_SECRET as string, {
        expiresIn: '15m'
      })
      console.log('Обновленный access-токен: ', accessToken)
      res.json({ accessToken })
    }
  } catch (error) {
    console.log(
      'Error [src/router/auth/authorizationUserRouter.ts] authorizationUserRouter/token/refresh:',
      error
    )
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Выход пользователя из системы
 *     description: Удаление refresh токена пользователя и выход из системы
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       description: Refresh токен для удаления
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *           example:
 *             refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       204:
 *         description: Успешный выход из системы
 *       404:
 *         description: Токен не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Token not found
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Error on the server, more details in the terminal
 */
authorizationUserRouter.post('/logout', async (req, res): Promise<void> => {
  const { refreshToken } = req.body

  try {
    const deletedTokens = await prisma.userRefreshToken.deleteMany({
      where: { refreshToken }
    })

    if (deletedTokens.count === 0) {
      res.status(404).json({ message: 'Token not found' })
    } else {
      res.status(204).send()
    }
  } catch (error) {
    console.log('Error [src/router/auth/authorizationUserRouter.ts] authorizationUserRouter/logout:', error)
    res.status(500).json({ error: 'Error on the server, more details in the terminal' })
  }
})

export default authorizationUserRouter
