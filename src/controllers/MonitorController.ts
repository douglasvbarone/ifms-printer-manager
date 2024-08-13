import { Router, Request, Response } from 'express'
import { prisma } from '../prisma.js'

const router = Router()

class MonitorController {
  static async status(req: Request, res: Response) {
    // If last status has a toner level below 20%, send an alert
    const { printerId } = req.params

    const status = await prisma.printerStatus.findFirst({
      where: {
        printer: {
          serialNumber: printerId
        }
      },
      orderBy: { timestamp: 'desc' }
    })

    if (status?.tonerBlackLevel && status.tonerBlackLevel < 25) {
      res.send('low toner')
    } else {
      res.send('ok')
    }
  }
}

router.get('/:printerId', MonitorController.status)

export default router
