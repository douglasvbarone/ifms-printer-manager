import { prisma } from '../prisma.js'
import { PrinterStatusService } from '../services/PrinterStatusService.js'

function updatePrinterStatus() {
  console.log(`Updating printers status ${new Date().toLocaleString()}`)

  prisma.printer.findMany().then(printers => {
    printers.forEach(async printer => {
      new PrinterStatusService(printer)
    })
  })
}

updatePrinterStatus()
