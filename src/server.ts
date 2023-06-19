import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import { injectUserMiddleware } from './middleware/injectUserMiddleware.js'
import { authMiddleware } from './middleware/authMiddleware.js'
import { hasRolesMiddleware } from './middleware/hasRolesMiddleware.js'

import { UserRouteController } from './controllers/routes/UserRouteController.js'
import { AuthenticationController } from './controllers/AuthenticationController.js'

export const app = express()

app.use('/', express.static('public'))

app.use(injectUserMiddleware)

app.use(bodyParser.json())

// Test route
app.get('/api/', async (req: Request, res: Response) => {
  res.json({ message: 'Hello!' })
})

// Login route
app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(400).json({ error: 'Missing username or password' })

  try {
    const token = await AuthenticationController.login(username, password)
    res.json({ token })
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
})

app.get('/api/me', authMiddleware, async (req: Request, res: Response) =>
  res.json(res.locals.user)
)

app.get(
  '/api/protected',
  authMiddleware,
  async (req: Request, res: Response) => {
    res.json('Hello protected world! ' + res.locals.user?.displayName)
  }
)

app.get(
  '/api/admin',
  hasRolesMiddleware(['ADMIN']),
  async (req: Request, res: Response) => {
    res.json('Hello Admin!' + res.locals.user?.username)
  }
)

app.get(
  '/api/user/:username',
  hasRolesMiddleware(['ADMIN']),
  UserRouteController.getOne
)
