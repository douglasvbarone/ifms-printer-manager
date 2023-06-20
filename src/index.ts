import 'dotenv/config'
import * as path from 'node:path'
import * as process from 'node:process'
import { fileURLToPath } from 'node:url'

import { app } from './server.js'
import Bree from 'bree'

const PORT = process.env.PORT || 3000

// Start server
app.listen(PORT, () => {
  console.log(
    `Running in ${
      process.env.NODE_ENV == 'production' ? 'PRODUCTION' : 'DEVELOPMENT'
    } mode. Server listening on port ${PORT}`
  )
})

// Jobs
const bree = new Bree({
  root: path.join(path.dirname(fileURLToPath(import.meta.url)), 'jobs'),
  defaultExtension: process.env.NODE_ENV == 'production' ? 'js' : 'ts',
  logger: false,
  jobs: [
    {
      name: 'printerStatus',
      interval: '2s'
    }
  ]
})

bree.start()
