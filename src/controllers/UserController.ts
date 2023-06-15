import { LdapController } from '../controllers/LdapController.js'
import { prisma } from '../prisma.js'

export class UserController {
  static async importUser(username: string) {
    const ldap = new LdapController()

    const user = await ldap.getUser(username)

    if (!user) throw new Error('User not found!')

    return await prisma.user.upsert({
      where: { username: user.username },
      update: user,
      create: user
    })
  }
}
