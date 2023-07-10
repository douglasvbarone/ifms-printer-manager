import { Response, NextFunction, Request } from 'express'
import log from '../log.js'

export async function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  log.http(
    'Request:',
    `${new Date().toLocaleString()} ${req.method} ${req.url} ${
      res.locals.user?.username
    } ${res.locals.user?.displayName}`
  )
  next()
}
