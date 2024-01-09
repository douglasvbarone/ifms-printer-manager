import snmp from 'net-snmp'
import { Printer } from '@prisma/client'
import { prisma } from '../prisma.js'
import {
  objectIdsRepository,
  PrinterObjectIds
} from '../repositories/ObjectIDRepository.js'
import log from '../log.js'

type VarbindString = {
  oid: string
  type: number
  value: string
}

export type Varbind = {
  oid: string
  type: number
  value: string | Buffer
}

export type PrinterInfo = {
  counter: number
  location: string
  toners: {
    black: {
      level: number
      model: string
    }
    cyan?: {
      level: number
      model: string
    }
    magenta?: {
      level: number
      model: string
    }
    yellow?: {
      level: number
      model: string
    }
  }
}

export class PrinterStatusService {
  constructor(private printer: Printer) {
    this.getPrinterSnmpStatus()
      .then(async printerStatus => {
        const lastStatus = await prisma.printerStatus.findFirst({
          where: { printerId: this.printer.id },
          orderBy: { timestamp: 'desc' }
        })

        if (
          lastStatus?.counter == printerStatus.counter &&
          lastStatus?.tonerBlackLevel == printerStatus.toners.black.level &&
          lastStatus?.tonerCyanLevel == printerStatus.toners.cyan?.level &&
          lastStatus?.tonerMagentaLevel ==
            printerStatus.toners.magenta?.level &&
          lastStatus?.tonerYellowLevel == printerStatus.toners.yellow?.level
        ) {
          await prisma.printerStatus.update({
            where: { id: lastStatus.id },
            data: { timestamp: new Date() }
          })
        } else {
          log.info(
            new Date().toLocaleString(),
            `Updating printer status ${this.printer.serialNumber} (${this.printer.ip}). Counter:${lastStatus?.counter} to ${printerStatus.counter}`
          )

          await prisma.printer.update({
            where: { serialNumber: this.printer.serialNumber },
            data: {
              location: printerStatus.location,
              blackTonerModel: printerStatus.toners.black.model,
              cyanTonerModel: printerStatus.toners.cyan?.model,
              magentaTonerModel: printerStatus.toners.magenta?.model,
              yellowTonerModel: printerStatus.toners.yellow?.model,

              status: {
                create: {
                  counter: printerStatus.counter,
                  tonerBlackLevel: printerStatus.toners.black.level,
                  tonerCyanLevel: printerStatus.toners.cyan?.level,
                  tonerMagentaLevel: printerStatus.toners.magenta?.level,
                  tonerYellowLevel: printerStatus.toners.yellow?.level
                }
              }
            }
          })
        }
      })
      .catch(err => {
        log.error(
          new Date().toLocaleString(),
          `Couldn't get printer status for ${printer.serialNumber} (IP:${printer.ip}). Error: ${err}`
        )
      })
  }

  private objectIdsArray(): string[] {
    const oIDsArray: string[] = []

    function extractObjValues(obj: any) {
      for (let key in obj) {
        if (typeof obj[key] === 'object') {
          extractObjValues(obj[key])
        } else {
          const oID = obj[key]
          oIDsArray.push(oID)
        }
      }
    }

    extractObjValues(
      objectIdsRepository.getPrinterObjectIds(this.printer.model).objectIds
    )

    return oIDsArray
  }

  private deBufferizeVarbinds(varbinds: Varbind[]) {
    const varbindsString: VarbindString[] = []

    varbinds?.forEach((varbind: Varbind) => {
      if (varbind.value instanceof Buffer)
        varbindsString.push({ ...varbind, value: varbind.value.toString() })
      else varbindsString.push({ ...varbind, value: varbind.value })
    })

    return varbindsString
  }

  static getPrinterModel(ip: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const snmpSession = snmp.createSession(ip, 'public')
      snmpSession.get(
        ['1.3.6.1.2.1.25.3.2.1.3.1'],
        (error: any, varbinds: any) => {
          if (error) {
            reject(error)
          } else {
            resolve(varbinds[0].value.toString())
          }
          snmpSession.close()
        }
      )
    })
  }

  static getPrinterSerialNumber(ip: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const snmpSession = snmp.createSession(ip, 'public')
      snmpSession.get(
        ['1.3.6.1.2.1.43.5.1.1.17.1'],
        (error: any, varbinds: any) => {
          if (error) {
            reject(error)
          } else {
            resolve(varbinds[0].value.toString())
          }
          snmpSession.close()
        }
      )
    })
  }

  async getPrinterSnmpStatus(): Promise<PrinterInfo> {
    return new Promise((resolve, reject) => {
      const session = snmp.createSession(this.printer.ip, 'public')

      const oIDsArray = this.objectIdsArray()

      session.get(oIDsArray, (error: any, varbinds: Varbind[]) => {
        if (error) reject(error)

        const varbindsString = this.deBufferizeVarbinds(varbinds)
        const snmpInfo = this.objectIDsToPrinterInfo(varbindsString)

        resolve(snmpInfo)
        session.close()
      })
    })
  }

  private calcTonerLevelPercentage(
    current: string | undefined,
    max: string | undefined
  ) {
    if (typeof current === 'undefined' || typeof max === 'undefined') return 0

    return Math.floor((+current! / +max!) * 100)
  }

  private objectIDsToPrinterInfo(varbinds: Varbind[]): PrinterInfo {
    const snmpInfo = this.deBufferizeVarbinds(varbinds)

    const { objectIds }: PrinterObjectIds =
      objectIdsRepository.getPrinterObjectIds(this.printer.model)

    const printerInfo: PrinterInfo = {
      counter: Number(snmpInfo.find(x => x.oid === objectIds.counter)?.value),
      location: snmpInfo.find(x => x.oid === objectIds.location)
        ?.value as string,
      toners: {
        black: {
          level: this.calcTonerLevelPercentage(
            snmpInfo.find(x => x.oid === objectIds.toners.black.current)?.value,
            snmpInfo.find(x => x.oid === objectIds.toners.black.max)?.value
          ),
          model: snmpInfo.find(x => x.oid === objectIds.toners.black.model)
            ?.value as string
        },
        cyan: objectIds.toners.cyan
          ? {
              level: this.calcTonerLevelPercentage(
                snmpInfo.find(x => x.oid === objectIds.toners.cyan?.current)
                  ?.value,
                snmpInfo.find(x => x.oid === objectIds.toners.cyan?.max)?.value
              ),
              model: snmpInfo.find(x => x.oid === objectIds.toners.cyan?.model)
                ?.value as string
            }
          : undefined,
        magenta: objectIds.toners.magenta
          ? {
              level: this.calcTonerLevelPercentage(
                snmpInfo.find(x => x.oid === objectIds.toners.magenta?.current)
                  ?.value,
                snmpInfo.find(x => x.oid === objectIds.toners.magenta?.max)
                  ?.value
              ),
              model: snmpInfo.find(
                x => x.oid === objectIds.toners.magenta?.model
              )?.value as string
            }
          : undefined,
        yellow: objectIds.toners.yellow
          ? {
              level: this.calcTonerLevelPercentage(
                snmpInfo.find(x => x.oid === objectIds.toners.yellow?.current)
                  ?.value,
                snmpInfo.find(x => x.oid === objectIds.toners.yellow?.max)
                  ?.value
              ),
              model: snmpInfo.find(
                x => x.oid === objectIds.toners.yellow?.model
              )?.value as string
            }
          : undefined
      }
    }

    return printerInfo
  }

  static async avgMonthPrint(serialNumber: string) {
    const gte = new Date(new Date().getTime() - 1000 * 3600 * 24 * 180)

    const firstPrinterStatus = await prisma.printerStatus.findFirst({
      where: {
        printer: {
          serialNumber
        },
        timestamp: {
          gte
        }
      },
      orderBy: { timestamp: 'asc' }
    })

    const lastPrinterStatus = await prisma.printerStatus.findFirst({
      where: {
        printer: {
          serialNumber
        },
        timestamp: {
          gte
        }
      },
      orderBy: { timestamp: 'desc' }
    })

    if (!firstPrinterStatus || !lastPrinterStatus) return 0

    const firstCounter = firstPrinterStatus.counter
    const lastCounter = lastPrinterStatus.counter

    const firstTimestamp = firstPrinterStatus.timestamp
    const lastTimestamp = lastPrinterStatus.timestamp

    const timeDiff = lastTimestamp.getTime() - firstTimestamp.getTime()

    const counterDiff = lastCounter - firstCounter

    const avgMonthPrint = Math.floor(
      counterDiff / (timeDiff / 1000 / 3600 / 24 / 30)
    )

    return avgMonthPrint
  }
}
