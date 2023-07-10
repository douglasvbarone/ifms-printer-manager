import log from '../log.js'
import { prisma } from '../prisma.js'
import { PrinterStatusService } from '../services/PrinterStatusService.js'

function updatePrinterStatus() {
  log.info(new Date().toLocaleString(), `Updating printers status`)

  prisma.printer.findMany().then(printers => {
    printers.forEach(async printer => {
      new PrinterStatusService(printer)
    })
  })
}

updatePrinterStatus()
