import { UserController } from '../UserController.js'
import { prisma } from '../../prisma.js'
import { Request, Response } from 'express'

export class UserRouteController {
  static async getOne(req: Request, res: Response) {
    const { username } = req.params

    if (!username) return res.status(400).json({ error: 'Missing username' })

    try {
      const user = await prisma.user.findUnique({
        where: { username }
      })

      if (!user) return await UserController.importUser(username)
      else UserController.importUser(username)

      res.json(user)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
