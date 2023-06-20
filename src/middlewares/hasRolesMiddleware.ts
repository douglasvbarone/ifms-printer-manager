import { Response, NextFunction, Request } from 'express'

import { Role } from '@prisma/client'

export function hasRolesMiddleware(roles: Role[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const userRoles = res.locals.user?.roles

      if (roles.some(role => userRoles?.includes(role))) next()
      else res.status(401).json({ error: 'Not authorized!' })
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  }
}
