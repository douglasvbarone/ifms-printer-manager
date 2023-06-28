import { Response, NextFunction, Request } from "express"

export async function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(
    "Request:",
    new Date().toLocaleString(),
    req.method,
    req.url,
    res.locals.user?.username,
    res.locals.user?.displayName
  )
  next()
}
