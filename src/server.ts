import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import { populateUserMiddleware } from './middlewares/populateUserMiddleware.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import { loggerMiddleware } from './middlewares/loggerMiddleware.js'

import LoginRouter from './controllers/LoginController.js'
import PrinterRouter from './controllers/PrinterController.js'
import PrinterStatusRouter from './controllers/PrinterStatusController.js'
import PrinterDiscoveryRouter from './controllers/PrinterDiscoveryController.js'

export const app = express()

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(populateUserMiddleware)
app.use(loggerMiddleware)

app.use('/api/login', LoginRouter)
app.use('/api/printer', PrinterRouter)
app.use('/api/printer-status', PrinterStatusRouter)
app.use('/api/discovery', PrinterDiscoveryRouter)

app.get('/api/me', authMiddleware, async (req: Request, res: Response) =>
  res.json(res.locals.user)
)
