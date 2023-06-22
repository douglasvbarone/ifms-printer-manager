import { PrinterDiscoveryService } from '../services/PrinterDiscoveryService.js'

async function discoverPrinters() {
  console.log(`Discovering printers ${new Date().toLocaleString()}`)

  await PrinterDiscoveryService.discoverAll()
}

discoverPrinters()
