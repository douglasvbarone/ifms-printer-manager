import { User } from '@prisma/client'
import { LdapService } from './LdapService.js'
import { prisma } from '../prisma.js'

const ADMIN_GROUP = process.env.ADMIN_GROUP || 'PP-SERTI'
const INSPECTOR_GROUP = process.env.INSPECTOR_GROUP || 'Inspectors'

export class UserService {
  static async importUser(username: string) {
    const ldap = new LdapService()

    const ldapUser = await ldap.getUser(username)

    if (!ldapUser) throw new Error('User not found!')

    const user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      username: ldapUser.username,
      displayName: ldapUser.displayName,
      mail: ldapUser.mail,
      thumbnailPhoto: ldapUser.thumbnailPhoto,
      campus: ldapUser.campus,
      roles: []
    }

    user.roles.push('USER') // Default role

    ldapUser.groups?.forEach(group => {
      if (group === ADMIN_GROUP) user.roles?.push('ADMIN')
      if (group === INSPECTOR_GROUP) user.roles?.push('INSPECTOR')
    })

    return await prisma.user.upsert({
      where: { username: ldapUser.username },
      update: user,
      create: user
    })
  }
}
