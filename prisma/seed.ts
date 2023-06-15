import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

async function main() {
  await prisma.printer.createMany({
    data: [
      {
        friendlyName: 'p04',
        ip: '10.7.0.134',
        model: 'm3655idn',
        serialNumber: 'R4P1478461'
      },
      {
        friendlyName: 'p05',
        ip: '10.7.0.135',
        model: 'm2040dn',
        serialNumber: 'VR91483974'
      },
      {
        friendlyName: 'p06',
        ip: '10.7.0.136',
        model: 'm2040dn',
        serialNumber: 'VR91586433'
      },
      {
        friendlyName: 'p07',
        ip: '10.7.0.137',
        model: 'm2040dn',
        serialNumber: 'VR91586432'
      },
      {
        friendlyName: 'p08',
        ip: '10.7.0.138',
        model: 'p6235cdn',
        serialNumber: 'RCG0304510'
      }
    ]
  })
}

main()
  .then(() => {
    prisma.$disconnect()
  })
  .catch(error => {
    console.error(error)
    prisma.$disconnect()
    process.exit(1)
  })
