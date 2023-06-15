import { Client } from 'ldapts'

const DOMAIN = process.env.AD_DOMAIN || 'IFMS'
const DN = process.env.AD_DN || 'DC=ifms,DC=edu,DC=br'
const BIND_USER = process.env.AD_BIND_USER || ''
const BIND_PASSWD = process.env.AD_BIND_PASSWORD || ''

interface LdapClient extends Client {
  adminBind: () => Promise<void>
  getUser(username: string): Promise<any>
  authenticate(username: string, password: string): Promise<any>
}

export const ldapClient = new Client({
  url: `ldap://${process.env.AD_HOST}`
}) as LdapClient

ldapClient.adminBind = async () => {
  await ldapClient.bind(`${DOMAIN}\\${BIND_USER}`, BIND_PASSWD)
}

ldapClient.getUser = async (username: string) => {
  await ldapClient.adminBind()

  const { searchEntries } = await ldapClient.search(DN, {
    scope: 'sub',
    filter: `(sAMAccountName=${username})`,
    attributes: [
      'cn',
      'mail',
      'sAMAccountName',
      'displayName',
      'thumbnailPhoto'
    ],
    explicitBufferAttributes: ['thumbnailPhoto']
  })

  await ldapClient.unbind()

  const { sAMAccountName, displayName, mail, thumbnailPhoto } = searchEntries[0]

  const user = {
    username: sAMAccountName.toString(),
    displayName: displayName.toString(),
    mail: mail.toString(),
    thumbnailPhoto: `data:image/png;base64,${Buffer.from(
      thumbnailPhoto as Buffer
    ).toString('base64')}`
  }

  return user
}

ldapClient.authenticate = async (username: string, password: string) => {
  try {
    await ldapClient.bind(`${DOMAIN}\\${username}`, password)
  } catch (error: any) {
    if (error.code === 49) {
      throw new Error('Invalid username or password')
    }
    throw error
  } finally {
    await ldapClient.unbind()
  }
}
