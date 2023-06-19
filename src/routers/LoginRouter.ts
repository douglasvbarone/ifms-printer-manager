import { LoginController } from '../controllers/LoginController.js'
import { Router } from 'express'

const router = Router()

router.post('/', LoginController.login)

export default router
