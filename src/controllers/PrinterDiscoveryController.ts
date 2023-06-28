import { Router, Request, Response } from 'express'

import { hasRolesMiddleware } from '../middlewares/hasRolesMiddleware.js'
import { PrinterDiscoveryService } from '../services/PrinterDiscoveryService.js'

const router = Router()

class PrinterDiscoveryController {
  static async discovery(req: Request, res: Response) {
    const task = await PrinterDiscoveryService.discoverAll()
    res.json(task)
  }
}

router.use(hasRolesMiddleware(['ADMIN', 'INSPECTOR']))

router.post('/', PrinterDiscoveryController.discovery)

export default router
