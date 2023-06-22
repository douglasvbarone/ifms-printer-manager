import 'dotenv/config'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { app } from './server.js'
import Bree from 'bree'

const PORT = process.env.PORT || 3000

// Start server
app.listen(PORT, () => {
  console.log(
    `Running in ${
      process.env.NODE_ENV == 'production' ? 'PRODUCTION' : 'DEVELOPMENT'
    } mode. \nServer listening http://127.0.0.1:${PORT}`
  )
})

// Jobs
const bree = new Bree({
  root: path.join(path.dirname(fileURLToPath(import.meta.url)), 'jobs'),
  defaultExtension: process.env.NODE_ENV == 'production' ? 'js' : 'ts',
  logger: false,
  jobs: [
    {
      name: 'updatePrinterStatus',
      interval: process.env.UPDATE_INTERVAL || '10m',
      timeout: 0
    },
    {
      name: 'discoverPrinters',
      cron: '0 */12 * * *'
    }
  ]
})

bree.start()
