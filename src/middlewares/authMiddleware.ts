import { Response, NextFunction, Request } from "express"

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!res.locals.user) {
      res.status(401).json({ error: "Must be logged in" })
      return
    }

    next()
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
}
