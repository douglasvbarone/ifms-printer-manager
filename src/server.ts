import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import { injectUserMiddleware } from './middleware/injectUserMiddleware.js'
import { authMiddleware } from './middleware/authMiddleware.js'

import { LoginRouteController } from './controllers/routes/LoginRouteController.js'

export const app = express()

app.use('/', express.static('public'))

app.use(injectUserMiddleware)

app.use(bodyParser.json())

app.post('/api/login', LoginRouteController.login)

app.get('/api/me', authMiddleware, async (req: Request, res: Response) =>
  res.json(res.locals.user)
)
