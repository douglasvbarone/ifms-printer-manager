import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import Bree from 'bree'
import { EventsController } from './controllers/EventsController.js'

export const jobs = new Bree({
  root: path.join(path.dirname(fileURLToPath(import.meta.url)), 'jobs'),
  defaultExtension: process.env.NODE_ENV == 'production' ? 'js' : 'ts',
  logger: false,

  jobs: [
    {
      name: 'updatePrinterStatus',
      interval: process.env.UPDATE_INTERVAL || '1m',
      timeout: 0
    },
    {
      name: 'discoverPrinters',
      cron: '0 */12 * * *'
    }
  ]
})

jobs.on('worker deleted', name => {
  if (name == 'updatePrinterStatus')
    EventsController.sendEvent({
      message: 'Printers updated',
      timestamp: new Date().toLocaleString()
    })
})
