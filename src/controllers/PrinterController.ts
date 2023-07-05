import { Request, Response, Router } from 'express'

import { hasRolesMiddleware } from '../middlewares/hasRolesMiddleware.js'
import { prisma } from '../prisma.js'

import { distributedCopy } from '../utils/distributedCopy.js'
import { PrinterStatusService } from '../services/PrinterStatusService.js'

const router = Router()

class PrinterController {
  static async index(req: Request, res: Response) {
    let { campus, force } = req.query

    if (!campus) campus = res.locals.user?.campus

    if (force) {
      const printers = await prisma.printer.findMany()
      console.log(`Updating printers status ${new Date().toLocaleString()}`)

      Promise.allSettled(
        printers.map(async printer => {
          new PrinterStatusService(printer)
        })
      )
    }

    let networkCriteria

    if (campus == 'RT')
      networkCriteria = { OR: [{ shortName: 'RT1' }, { shortName: 'RT2' }] }

    if (campus == 'ALL') networkCriteria = undefined
    else if (campus) networkCriteria = { shortName: String(campus) }

    const printers = await prisma.printer.findMany({
      where: {
        network: networkCriteria
      },
      include: {
        network: true,
        status: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { ip: 'asc' }
    })

    return res.json(printers)
  }

  static async show(req: Request, res: Response) {
    const { serialNumber } = req.params
    const { take = 32, days = 60 } = req.query

    const gte = new Date(Date.now() - 1000 * 60 * 60 * 24 * Number(days))

    const printer = await prisma.printer.findUnique({
      where: { serialNumber: serialNumber },
      include: {
        status: {
          where: {
            timestamp: {
              gte
            }
          },

          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    })

    if (printer)
      res.json({
        ...printer,
        status: distributedCopy(printer.status, Number(take))
      })
    else res.status(400).json({ error: 'Printer not found' })
  }

  static async edit(req: Request, res: Response) {
    const { id } = req.params
    const { friendlyName } = req.body

    // Verify if printer exists
    const printerExists = await prisma.printer.findUnique({
      where: { id: Number(id) }
    })

    if (printerExists) {
      const printer = await prisma.printer.update({
        where: { id: Number(id) },
        data: { friendlyName }
      })

      res.json(printer)
    } else {
      res.status(400).json({ error: 'Printer not found' })
    }
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
router.delete('/:id', PrinterController.delete)

export default router
