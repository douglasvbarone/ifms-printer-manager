import jwt from "jsonwebtoken"
import { prisma } from "../prisma.js"
import { LdapService } from "./LdapService.js"
import { UserService } from "./UserService.js"
import { User } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "secret"

export class AuthenticationService {
  private constructor() {}

  static async login(username: string, password: string) {
    const ldap = new LdapService()

    await ldap.authenticate(username, password)

    await UserService.importUser(username)

    const token = jwt.sign({ username }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "30 days",
    })

    return `Bearer ${token}`
  }

  static async jwtAuth(token: string): Promise<User> {
    try {
      const { username } = jwt.verify(token, JWT_SECRET) as { username: string }

      const user = await prisma.user.findUnique({
        where: { username },
      })

      if (!user) return await UserService.importUser(username)

      return user
    } catch (error: any) {
      throw new Error(`Invalid token. ${error.message}`)
    }
  }
}
