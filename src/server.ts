import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { populateUserMiddleware } from './middlewares/populateUserMiddleware.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import { loggerMiddleware } from './middlewares/loggerMiddleware.js'

import LoginRouter from './controllers/LoginController.js'
import PrinterRouter from './controllers/PrinterController.js'
import PrinterStatusRouter from './controllers/PrinterStatusController.js'
import PrinterDiscoveryRouter from './controllers/PrinterDiscoveryController.js'

export const app = express()

app.use(cors())
app.use(loggerMiddleware)

app.use('/api', bodyParser.json())

app.use('/api', populateUserMiddleware)

app.use('/api/login', LoginRouter)
app.use('/api/printer', PrinterRouter)
app.use('/api/printer-status', PrinterStatusRouter)
app.use('/api/discovery', PrinterDiscoveryRouter)

app.use('/', express.static('public'))

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: './public' })
})
