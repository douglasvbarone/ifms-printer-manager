import 'dotenv/config'

import { app } from './server.js'
import { jobs } from './jobs.js'

const PORT = process.env.PORT || 8000

// Start server
app.listen(PORT, () => {
  console.log(
    `Running in ${
      process.env.NODE_ENV == 'production' ? 'PRODUCTION' : 'DEVELOPMENT'
    } mode. \nServer listening http://127.0.0.1:${PORT}`
  )
})

// Start jobs
jobs.start()
