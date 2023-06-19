import { Request, Response } from 'express'
import { AuthenticationController } from '../AuthenticationController.js'

export class LoginRouteController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body

    if (!username || !password)
      return res.status(400).json({ error: 'Missing username or password' })

    try {
      const token = await AuthenticationController.login(username, password)
      res.json({ token })
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  }
}
