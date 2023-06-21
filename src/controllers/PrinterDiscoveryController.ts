import { Router, Request, Response } from 'express'

import { hasRolesMiddleware } from '../middlewares/hasRolesMiddleware.js'
import { PrinterDiscoveryService } from '../services/PrinterDiscoveryService.js'
import { prisma } from '../prisma.js'
import { PrinterStatusService } from '../services/PrinterStatusService.js'
import { Printer } from '@prisma/client'

const router = Router()

class PrinterDiscoveryController {
  static async discovery(req: Request, res: Response) {
    const networks = await prisma.network.findMany()

    const newPrinters: Printer[] = []
    const discoveredPrintersIPs: string[] = []

    for (const network of networks) {
      console.log('Discovering printers for network', network.cidr)

      try {
        const discoveredPrintersIPsForNetwork =
          await PrinterDiscoveryService.discovery(network.cidr)

        discoveredPrintersIPs.push(...discoveredPrintersIPsForNetwork)
      } catch (error) {
        console.log(error)
      }

      const printers = await prisma.printer.findMany()

      const newPrintersIPs = discoveredPrintersIPs.filter(
        ip => !printers.find(printer => printer.ip === ip)
      )

      await Promise.allSettled(
        newPrintersIPs.map(async ip => {
          const model = await PrinterStatusService.getPrinterModel(ip)
          const printer = await prisma.printer.create({
            data: { ip, model, networkId: network.id }
          })

          new PrinterStatusService(printer)

          newPrinters.push(printer)
        })
      )
    }

    res.json({ discoveredPrintersIPs, newPrinters })
  }
}

router.use(hasRolesMiddleware(['ADMIN', 'INSPECTOR']))

router.post('/', PrinterDiscoveryController.discovery)

export default router
