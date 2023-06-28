import { Request, Response, Router } from 'express'
import { AuthenticationService } from '../services/AuthenticationService.js'
import { InvalidCredentialsError } from 'ldapts'
import { User } from '@prisma/client'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

class LoginController {
  static async login(req: Request, res: Response) {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({ error: 'Usuário e senha devem ser informados!' })
      return
    }

    try {
      const token = await AuthenticationService.login(username, password)
      res.json({ token })
    } catch (error: any) {
      if (error instanceof InvalidCredentialsError) {
        res.status(401).json({ error: 'Usuário ou senha inválidos' })
        return
      }
      res.status(401).json({ error: error.message })
    }
  }

  static async me(req: Request, res: Response) {
    res.json(res.locals.user as User)
  }
}

router.post('/', LoginController.login)
router.get('/me', authMiddleware, LoginController.me)

export default router
