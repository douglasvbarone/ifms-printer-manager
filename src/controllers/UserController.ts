import { ldapClient } from '../ldapClient.js'
import { prisma } from '../prisma.js'

export class UserController {
  static async importUser(username: string) {
    const user = await ldapClient.getUser(username)

    return await prisma.user.upsert({
      where: { username: user.username },
      update: user,
      create: user
    })
  }

  static async getUser(username: string) {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    try {
      if (!user) return await UserController.importUser(username)
      else UserController.importUser(username)

      return user
    } catch (error: any) {
      throw new Error('User not found!' + error.message)
    }
  }
}
