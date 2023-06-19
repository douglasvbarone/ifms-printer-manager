import { Request, Response } from 'express'
import { AuthenticationService } from '../services/AuthenticationService.js'

export class LoginController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({ error: 'Missing username or password' })
      return
    }

    try {
      const token = await AuthenticationService.login(username, password)
      res.json({ token })
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  }
}
