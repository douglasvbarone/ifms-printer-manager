import { Client } from 'ldapts'

const DOMAIN = process.env.AD_DOMAIN || 'IFMS'
const DN = process.env.AD_DN || 'DC=ifms,DC=edu,DC=br'
const BIND_USER = process.env.AD_BIND_USER || ''
const BIND_PASSWD = process.env.AD_BIND_PASSWORD || ''

interface LdapClientInterface extends Client {
  authenticate(username: string, password: string): Promise<void>
  getUser(username: string): Promise<any>
}

type LdapUser = {
  username: string
  mail: string | null
  displayName: string
  thumbnailPhoto: string | null
  groups?: string[]
}

export class LdapController extends Client implements LdapClientInterface {
  private static instance: LdapController

  constructor() {
    if (LdapController.instance) return LdapController.instance

    super({
      url: `ldap://${process.env.AD_HOST}`
    })

    LdapController.instance = this
  }

  /**
   * Execute a function using the ldap admin credentials.
   */
  private async adminBondOperation(cb: () => Promise<any>) {
    try {
      await this.bind(`${DOMAIN}\\${BIND_USER}`, BIND_PASSWD)

      return await cb()
    } catch (error: any) {
      throw new Error(`Error doing an Admin-bonded LDAP operation. ${error}`)
    } finally {
      await this.unbind()
    }
  }

  async getUser(username: string): Promise<LdapUser> {
    return await this.adminBondOperation(async () => {
      const { searchEntries } = await this.search(DN, {
        scope: 'sub',
        filter: `(sAMAccountName=${username})`,
        attributes: [
          'mail',
          'sAMAccountName',
          'displayName',
          'thumbnailPhoto',
          'dn'
        ],
        explicitBufferAttributes: ['thumbnailPhoto']
      })

      if (!searchEntries.length)
        throw new Error('User not found on LDAP server.')

      const { sAMAccountName, displayName, mail, thumbnailPhoto, dn } =
        searchEntries[0]

      const ldapUser: LdapUser = {
        username: sAMAccountName.toString(),
        displayName: displayName.toString(),
        mail: mail.toString(),
        thumbnailPhoto: `data:image/png;base64,${Buffer.from(
          thumbnailPhoto as Buffer
        ).toString('base64')}`,
        groups: await this.getGroupsForUser(dn.toString())
      }

      return ldapUser
    })
  }

  async getGroupsForUser(dn: string) {
    const { searchEntries } = await this.search(DN, {
      scope: 'sub',
      filter: `(member:1.2.840.113556.1.4.1941:=${dn})`,
      attributes: ['cn']
    })

    if (!searchEntries.length) throw new Error('User not found on LDAP server.')

    return searchEntries.map(entry => entry.cn.toString())
  }

  async authenticate(username: string, password: string) {
    await this.bind(`${DOMAIN}\\${username}`, password)

    await this.unbind()
  }
}
