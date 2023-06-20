import { Request, Response, Router } from 'express'

import { hasRolesMiddleware } from '../middlewares/hasRolesMiddleware.js'
import { prisma } from '../prisma.js'

const router = Router()

class PrinterController {
  static async index(req: Request, res: Response) {
    const printers = await prisma.printer.findMany()

    res.json(printers)
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params

    // 30 days
    const gte = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)

    const printer = await prisma.printer.findUnique({
      where: { id: Number(id) },
      include: {
        PrinterStatus: {
          where: {
            createdAt: {
              gte
            }
          }
        }
      }
    })

    res.json(printer)
  }

  static async create(req: Request, res: Response) {
    const { friendlyName, ip, location } = req.body

    const printer = await prisma.printer.create({
      data: { friendlyName, ip, location }
    })

    // Run snmp here

    res.json(printer)
  }

  static async edit(req: Request, res: Response) {
    const { id } = req.params
    const { friendlyName, ip, location } = req.body

    const printer = await prisma.printer.update({
      where: { id: Number(id) },
      data: { friendlyName, ip, location }
    })

    res.json(printer)
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params

    await prisma.printer.delete({ where: { id: Number(id) } })

    res.json({ message: 'Printer deleted' })
  }
}

router.use(hasRolesMiddleware(['ADMIN', 'INSPECTOR']))

router.get('/', PrinterController.index)
router.get('/:id', PrinterController.show)
router.put('/:id', PrinterController.edit)

export default router
