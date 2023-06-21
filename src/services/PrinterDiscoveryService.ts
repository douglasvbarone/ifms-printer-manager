import snmp from 'net-snmp'
import netmask from 'netmask'

export class PrinterDiscoveryService {
  private static async isPrinter(ip: string) {
    if (ip == '10.7.0.51') return false
    return new Promise((resolve, reject) => {
      const session = snmp.createSession(ip, 'public', { timeout: 1000 })

      const CHECK_OID = '1.3.6.1.2.1.1.1.0'
      const CHECK_STRING = 'KYOCERA Document Solutions Printing System'

      session.get(
        [CHECK_OID],
        (error: any, varbinds: any) => {
          if (error) {
            resolve(false)
          } else {
            if (varbinds[0].value.toString() === CHECK_STRING) {
              resolve(true)
            } else {
              resolve(false)
            }
          }
          session.close()
        },
        { timeout: 1000 }
      )
    })
  }

  // Check every IP in the range for a printer and return an array of IPs that are printers
  static async discovery(cdir: string): Promise<string[]> {
    const printers: string[] = []
    const blockIPs: string[] = []

    try {
      const block = new netmask.Netmask(cdir)

      const BLACK_LISTED_IPS = ['10.7.1.1', '10.7.0.51']

      block.forEach(ip => {
        if (!BLACK_LISTED_IPS.includes(ip)) blockIPs.push(ip)
      })
    } catch (err) {
      throw new Error('Invalid IP CIDR')
    }

    try {
      await Promise.allSettled(
        blockIPs.map(async ip => {
          try {
            if (await PrinterDiscoveryService.isPrinter(ip)) {
              printers.push(ip)
              console.log(`Found printer at ${ip}!`)
            }
          } catch (error: any) {
            console.log(`Error checking ${ip}: ${error.message}`)
          }
        })
      )
    } catch (err) {
      console.log(err)
    }

    return printers
  }
}
