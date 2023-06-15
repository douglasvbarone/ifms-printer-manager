import 'dotenv/config'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

import { injectUserMiddleware } from './middleware/injectUserMiddleware.js'
import { authMiddleware } from './middleware/authMiddleware.js'
import { hasRolesMiddleware } from './middleware/hasRolesMiddleware.js'

import { RequestWithUser } from './types.js'
import { login } from './authentication.js'

import { UserRouteController } from './controllers/UserRouteController.js'

const app = express()

const PORT = process.env.PORT || 3000

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
    const token = await login(username, password)
    res.json({ token })
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
})

app.get(
  '/api/me',
  authMiddleware,
  async (req: RequestWithUser, res: Response) => res.json(req.user)
)

app.get(
  '/api/protected',
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    res.json('Hello protected world! ' + req.user?.displayName)
  }
)

app.get(
  '/api/admin',
  await hasRolesMiddleware(['ADMIN']),
  async (req: RequestWithUser, res: Response) => {
    res.json('Hello Admin!' + req.user?.username)
  }
)

app.get(
  '/api/user/:username',
  await hasRolesMiddleware(['ADMIN']),
  UserRouteController.get
)

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
