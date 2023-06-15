import { NextFunction, Request, Response } from 'express'
import { RequestWithUser } from '../types.js'
import { authenticate } from '../authentication.js'

function getToken(req: Request) {
  const authHeader = req.headers.authorization as string

  if (!authHeader) return null

  const [type, token] = authHeader.split(' ')
  if (type !== 'Bearer') throw new Error('Expected a Bearer token')

  return token
}

export async function injectUserMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const token = getToken(req)

  if (token) {
    const user = await authenticate(token)
    req.user = user
  }

  next()
}
