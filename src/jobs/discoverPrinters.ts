import log from '../log.js'
import { PrinterDiscoveryService } from '../services/PrinterDiscoveryService.js'

async function discoverPrinters() {
  log.info(new Date().toLocaleString(), `Discovering printers`)

  await PrinterDiscoveryService.discoverAll()
}

discoverPrinters()
