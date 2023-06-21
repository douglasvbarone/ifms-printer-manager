import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

async function main() {
  console.log('Seeding printers...')

  console.log('Seeding subnets...')

  await prisma.network.createMany({
    data: [
      {
        shortName: 'RT1',
        name: 'Reitoria',
        cidr: '10.0.0.0/21'
      },
      {
        shortName: 'RT2',
        name: 'Reitoria 2',
        cidr: '10.1.0.0/21'
      },
      {
        shortName: 'AQ',
        name: 'Aquidauana',
        cidr: '10.2.0.0/21'
      },
      {
        shortName: 'CG',
        name: 'Campo Grande',
        cidr: '10.3.0.0/21'
      },
      {
        shortName: 'CB',
        name: 'Corumbá',
        cidr: '10.4.0.0/21'
      },
      {
        shortName: 'CX',
        name: 'Coxim',
        cidr: '10.5.0.0/21'
      },
      {
        shortName: 'NA',
        name: 'Nova Andradina',
        cidr: '10.6.0.0/21'
      },
      {
        shortName: 'PP',
        name: 'Ponta Porã',
        cidr: '10.7.0.0/21'
      },
      {
        shortName: 'TL',
        name: 'Três Lagoas',
        cidr: '10.8.0.0/21'
      },
      {
        shortName: 'JD',
        name: 'Jardim',
        cidr: '10.9.0.0/21'
      },
      {
        shortName: 'NV',
        name: 'Naviraí',
        cidr: '10.10.0.0/21'
      },
      {
        shortName: 'DR',
        name: 'Dourados',
        cidr: '10.11.0.0/21'
      }
    ],
    skipDuplicates: true
  })

  await prisma.printer.createMany({
    data: [
      {
        friendlyName: 'P04',
        ip: '10.7.0.134',
        model: 'ECOSYS M3655idn',
        serialNumber: 'R4P1478461',
        networkId: 8
      },
      {
        friendlyName: 'P05',
        ip: '10.7.0.135',
        model: 'ECOSYS M2040dn',
        serialNumber: 'VR91483974',
        networkId: 8
      },
      {
        friendlyName: 'P06',
        ip: '10.7.0.136',
        model: 'ECOSYS M2040dn',
        serialNumber: 'VR91586433',
        networkId: 8
      },
      {
        friendlyName: 'P07',
        ip: '10.7.0.137',
        model: 'ECOSYS M2040dn',
        serialNumber: 'VR91586432',
        networkId: 8
      },
      {
        friendlyName: 'P08',
        ip: '10.7.0.138',
        model: 'ECOSYS P6235cdn',
        serialNumber: 'RCG0304510',
        networkId: 8
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
