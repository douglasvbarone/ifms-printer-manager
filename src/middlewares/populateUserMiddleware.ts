import { NextFunction, Request, Response } from 'express'
import { AuthenticationService } from '../services/AuthenticationService.js'

function getToken(req: Request) {
  const authHeader = req.headers.authorization as string

  if (!authHeader) return null

  const [type, token] = authHeader.split(' ')
  if (type !== 'Bearer') throw new Error('Expected a Bearer token')

  return token
}

export async function populateUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getToken(req)

  if (token) {
    try {
      const user = await AuthenticationService.jwtAuth(token)
      res.locals.user = user
    } catch (error: any) {
      res.locals.user = null
    }
  }

  next()
}
