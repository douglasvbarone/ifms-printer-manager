import { Response, NextFunction } from 'express'
import { RequestWithUser } from '../types.js'
import { Role } from '@prisma/client'

export async function hasRolesMiddleware(roles: Role[]) {
  return async function (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userRoles = req.user?.roles

      if (roles.some(role => userRoles?.includes(role))) next()
      else res.status(401).json({ error: 'Not authorized!' })
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  }
}
