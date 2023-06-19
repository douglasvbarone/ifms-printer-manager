import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import { injectUserMiddleware } from './middleware/injectUserMiddleware.js'
import { authMiddleware } from './middleware/authMiddleware.js'

import LoginRouter from './controllers/LoginController.js'

export const app = express()

app.use('/', express.static('public'))

app.use(bodyParser.json())
app.use(injectUserMiddleware)

app.use('/api/login', LoginRouter)

app.get('/api/me', authMiddleware, async (req: Request, res: Response) =>
  res.json(res.locals.user)
)
