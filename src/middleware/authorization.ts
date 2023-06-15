import { Request, Response, NextFunction } from 'express'
import { authenticate } from '../authentication.js'
import { RequestWithUser } from '../types.js'
import { Role } from '@prisma/client'

function getToken(req: Request) {
  const authHeader = req.headers.authorization as string

  if (!authHeader) return null

  const [type, token] = authHeader.split(' ')
  if (type !== 'Bearer') throw new Error('Expected a Bearer token')

  return token
}

async function injectUser(req: RequestWithUser) {
  const token = getToken(req)

  if (!token) return null

  const user = await authenticate(token)

  req.user = user
}

export async function authenticatedMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    await injectUser(req)

    if (!req.user) {
      res.status(401).json({ error: 'Must be logged in' })
      return
    }

    next()
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
}

export async function hasRolesMiddleware(roles: Role[]) {
  return async function (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      await injectUser(req)

      const userRoles = req.user?.roles

      if (userRoles === undefined) {
        throw new Error('User has no roles')
      }

      if (roles.some(role => userRoles.includes(role))) next()
      else res.status(401).json({ error: 'Not authorized!' })
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  }
}
