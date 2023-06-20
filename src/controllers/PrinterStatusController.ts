import { Router, Request, Response } from 'express'
import { prisma } from '../prisma.js'
import { PrinterStatusService } from '../services/PrinterStatusService.js'

const router = Router()

class PrinterStatusController {
  static async update(req: Request, res: Response) {
    const printers = await prisma.printer.findMany()

    printers.forEach(async printer => {
      new PrinterStatusService(printer)
    })

    res.json({ message: 'Updating printer status' })
  }
}

router.post('/update', PrinterStatusController.update)

export default router
