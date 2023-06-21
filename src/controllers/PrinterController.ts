import { Request, Response, Router } from 'express'

import { hasRolesMiddleware } from '../middlewares/hasRolesMiddleware.js'
import { prisma } from '../prisma.js'
import { PrinterStatusService } from '../services/PrinterStatusService.js'
import { distributedCopy } from '../utils/distributedCopy.js'
import { Netmask } from 'netmask'
import { isIPv4 } from 'net'

const router = Router()

class PrinterController {
  static async index(req: Request, res: Response) {
    const { campus } = req.query

    if (!campus) {
      const printers = await prisma.printer.findMany({
        include: { network: true }
      })
      return res.json(printers)
    }

    const printers = await prisma.printer.findMany({
      where: {
        network: {
          shortName: String(campus)
        }
      },
      include: { network: true }
    })

    return res.json(printers)
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params
    const { take = 64, days = 60 } = req.query

    const gte = new Date(Date.now() - 1000 * 60 * 60 * 24 * Number(days))

    const printer = await prisma.printer.findUnique({
      where: { id: Number(id) },
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

  // static async create(req: Request, res: Response) {
  //   const { friendlyName, ip } = req.body

  //   const ipBlock = new Netmask(ip)

  //   if (!isIPv4(ip)) {
  //     res.status(400).json({ error: 'Invalid IP' })
  //     return
  //   }

  //   try {
  //     const model = await PrinterStatusService.getPrinterModel(ip)
  //     const printer = await prisma.printer.create({
  //       data: {
  //         friendlyName,
  //         ip,
  //         model,
  //         network: {
  //           connect: {}
  //         }
  //       }
  //     })

  //     new PrinterStatusService(printer)

  //     res.json(printer)
  //   } catch (e) {
  //     res
  //       .status(400)
  //       .json({ error: 'Este IP não é de uma impressora suportada.' })
  //     return
  //   }
  // }

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
// router.post('/', PrinterController.create)
router.get('/:id', PrinterController.show)
router.put('/:id', PrinterController.edit)
router.delete('/:id', PrinterController.delete)

export default router
