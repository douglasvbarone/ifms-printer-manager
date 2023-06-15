import jwt from 'jsonwebtoken'
import { prisma } from './prisma.js'
import { LdapController } from './controllers/LdapController.js'
import { UserController } from './controllers/UserController.js'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export async function login(username: string, password: string) {
  const ldap = new LdapController()

  await ldap.authenticate(username, password)

  await UserController.importUser(username)

  const token = jwt.sign({ username }, JWT_SECRET, {
    expiresIn: '2 days'
  })

  return `Bearer ${token}`
}

export async function authenticate(token: string) {
  try {
    const { username } = jwt.verify(token, JWT_SECRET) as { username: string }

    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) return null

    return user
  } catch (error: any) {
    throw new Error('Invalid token')
  }
}
