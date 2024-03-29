import { Router, Request, Response } from 'express'
import { prisma } from '../prisma.js'
import { PrinterStatusService } from '../services/PrinterStatusService.js'
import { hasRolesMiddleware } from '../middlewares/hasRolesMiddleware.js'

const router = Router()

class PrinterStatusController {
  static async update(req: Request, res: Response) {
    const printers = await prisma.printer.findMany()

    printers.forEach(async printer => {
      new PrinterStatusService(printer)
    })

    res.json({ message: 'Updating printer status' })
  }

  static async status(req: Request, res: Response) {
    const { printerId } = req.params

    const { days = 360 } = req.query

    const gte = new Date(Date.now() - 1000 * 60 * 60 * 24 * Number(days))

    const status = await prisma.printerStatus.findMany({
      where: {
        printerId: Number(printerId),
        timestamp: {
          gte
        }
      },
      orderBy: { timestamp: 'desc' }
    })

    res.json(status)
  }
}

router.use(hasRolesMiddleware(['ADMIN', 'INSPECTOR']))

router.post('/update', PrinterStatusController.update)
router.get('/:printerId', PrinterStatusController.status)

export default router
