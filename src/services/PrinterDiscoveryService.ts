import snmp from 'net-snmp'
import netmask from 'netmask'
import { PrinterStatusService } from './PrinterStatusService.js'
import { prisma } from '../prisma.js'
import { Printer } from '@prisma/client'
import log from '../log.js'
import { objectIdsRepository } from '../repositories/ObjectIDRepository.js'

export class PrinterDiscoveryService {
  private static async isPrinter(ip: string) {
    if (ip == '10.7.0.51') return false
    return new Promise((resolve, reject) => {
      const session = snmp.createSession(ip, 'public', { timeout: 1000 })

      const CHECK_OID = '1.3.6.1.2.1.1.1.0'
      const CHECK_STRING = 'KYOCERA Document Solutions Printing System'

      session.get(
        [CHECK_OID],
        (error: any, varbinds: any) => {
          if (error) {
            resolve(false)
          } else {
            if (varbinds[0].value.toString() === CHECK_STRING) {
              resolve(true)
            } else {
              resolve(false)
            }
          }
          session.close()
        },
        { timeout: 1000 }
      )
    })
  }

  // Check every IP in the range for a printer and return an array of IPs that are printers
  static async discovery(
    cdir: string
  ): Promise<{ supportedPrinters: string[]; unsupportedPrinters: string[] }> {
    const printers: string[] = []
    const blockIPs: string[] = []
    const unsupportedPrinters: string[] = []

    try {
      const block = new netmask.Netmask(cdir)

      const BLACK_LISTED_IPS = ['10.7.1.1', '10.7.0.51']

      block.forEach(ip => {
        if (!BLACK_LISTED_IPS.includes(ip)) blockIPs.push(ip)
      })
    } catch (err) {
      throw new Error('Invalid IP CIDR')
    }

    try {
      await Promise.allSettled(
        blockIPs.map(async ip => {
          try {
            if (await PrinterDiscoveryService.isPrinter(ip)) {
              const model = await PrinterStatusService.getPrinterModel(ip)

              try {
                objectIdsRepository.getPrinterObjectIds(model)
                printers.push(ip)
                log.info(
                  new Date().toLocaleString(),
                  `Found printer at IP: ${ip}`
                )
              } catch (error) {
                unsupportedPrinters.push(ip)
                log.info(
                  new Date().toLocaleString(),
                  `Found unsupported printer at IP: ${ip}`
                )
              }
            }
          } catch (error: any) {
            log.error(
              new Date().toLocaleString(),
              `Error checking ${ip}: ${error.message}`
            )
          }
        })
      )
    } catch (error: any) {
      log.error(new Date().toLocaleString(), error)
    }

    return {
      supportedPrinters: printers,
      unsupportedPrinters
    }
  }

  static async discoverAll() {
    const networks = await prisma.network.findMany()

    const newPrinters: Printer[] = []
    const supportedPrintersIPs: string[] = []
    const unsupportedPrintersIPs: string[] = []

    for (const network of networks) {
      log.info(
        new Date().toLocaleString(),
        'Discovering printers for network',
        network.cidr
      )

      try {
        const discoveredPrintersIPsForNetwork =
          await PrinterDiscoveryService.discovery(network.cidr)

        supportedPrintersIPs.push(
          ...discoveredPrintersIPsForNetwork.supportedPrinters
        )
        unsupportedPrintersIPs.push(
          ...discoveredPrintersIPsForNetwork.unsupportedPrinters
        )
      } catch (error: any) {
        log.error(new Date().toLocaleString(), error)
      }

      const printers = await prisma.printer.findMany()

      const newPrintersIPs = supportedPrintersIPs.filter(
        ip => !printers.find(printer => printer.ip === ip)
      )

      await Promise.allSettled(
        newPrintersIPs.map(async ip => {
          const model = await PrinterStatusService.getPrinterModel(ip)
          const serialNumber =
            await PrinterStatusService.getPrinterSerialNumber(ip)

          const printer = await prisma.printer.upsert({
            where: { serialNumber },
            create: { ip, model, networkId: network.id, serialNumber },
            update: { ip, model, networkId: network.id }
          })

          new PrinterStatusService(printer)

          newPrinters.push(printer)
        })
      )
    }

    return { supportedPrintersIPs, newPrinters, unsupportedPrintersIPs }
  }
}
