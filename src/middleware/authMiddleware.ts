import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../types/RequestWithUser.js'

export async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Must be logged in' })
      return
    }

    next()
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
}
