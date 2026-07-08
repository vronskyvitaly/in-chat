import { Response, NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'

// Расширяем интерфейс Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
      }
    }
  }
}

interface DecodedToken {
  userId: string
  iat?: number
  exp?: number
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: 'Token not provided' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: jwt.VerifyErrors | null, decoded): void => {
    if (err) {
      console.log('Error in validate token [src/middleware/authenticate-token/index.ts] authenticateToken:')
      res.status(401).json({ message: 'Invalid token' })
      return
    }

    // ✅ Type assertion с проверкой структуры
    const tokenData = decoded as DecodedToken

    if (!tokenData.userId) {
      res.status(401).json({ message: 'Invalid token structure' })
      return
    }

    // Сохраняем информацию о пользователе в запросе
    req.user = { userId: tokenData.userId }
    next()
  })
}

export default authenticateToken
