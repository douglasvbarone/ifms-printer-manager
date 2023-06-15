import 'dotenv/config'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { login } from './authentication.js'
import {
  authenticatedMiddleware,
  hasRolesMiddleware
} from './middleware/authorization.js'
import { RequestWithUser } from './types.js'
import { UserController } from './controllers/UserController.js'

const app = express()

const PORT = process.env.PORT || 3000

app.use('/', express.static('public'))

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
  authenticatedMiddleware,
  async (req: RequestWithUser, res: Response) => res.json(req.user)
)

app.get(
  '/api/protected',
  authenticatedMiddleware,
  async (req: RequestWithUser, res: Response) => {
    res.send('Hello protected world! ' + req.user?.displayName)
  }
)

app.get(
  '/api/admin',
  await hasRolesMiddleware(['ADMIN']),
  async (req: RequestWithUser, res: Response) => {
    res.send('Hello Admin!' + req.user?.username)
  }
)

app.get(
  '/api/user/:username',
  await hasRolesMiddleware(['ADMIN']),
  async (req: Request, res: Response) => {
    const { username } = req.params

    res.json(await UserController.getUser(username))
  }
)

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
