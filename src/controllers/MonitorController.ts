import { Router, Request, Response } from 'express'
import { prisma } from '../prisma.js'

const router = Router()

class MonitorController {
  static async status(req: Request, res: Response) {
    // If last status has a toner level below 25%, send an alert
    const { serialNumber } = req.params

    const status = await prisma.printerStatus.findFirst({
      where: {
        printer: {
          serialNumber: serialNumber
        }
      },
      select: {
        tonerBlackLevel: true
      },
      orderBy: { id: 'desc' }
    })

    if (status?.tonerBlackLevel && status.tonerBlackLevel < 25) {
      res.send(`Toner baixo! ${status.tonerBlackLevel}%`)
    } else {
      res.send('ok')
    }
  }
}

router.get('/:serialNumber', MonitorController.status)

export default router
