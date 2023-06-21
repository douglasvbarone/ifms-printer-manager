import snmp from 'net-snmp'
import { Printer, PrinterStatus } from '@prisma/client'
import { prisma } from '../prisma.js'
import {
  objectIdsRepository,
  PrinterObjectIds
} from '../repositories/ObjectIDRepository.js'

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
  serialNumber: string
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
    this.getPrinterInfo().then(async printerStatus => {
      await prisma.printer.update({
        where: { id: this.printer.id },
        data: {
          serialNumber: printerStatus.serialNumber,
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

  async getPrinterInfo(): Promise<PrinterInfo> {
    return new Promise((resolve, reject) => {
      const session = snmp.createSession(this.printer.ip, 'public')

      const oIDsArray = this.objectIdsArray()

      session.get(oIDsArray, (error: any, varbinds: Varbind[]) => {
        if (error) reject(error)

        const varbindsString = this.deBufferizeVarbinds(varbinds)
        const info = this.objectIDsToPrinterInfo(varbindsString)

        resolve(info)
        session.close()
      })
    })
  }

  private calcTonerLevelPercentage(
    current: string | undefined,
    max: string | undefined
  ) {
    if (typeof current === 'undefined' || typeof max === 'undefined')
      throw new Error('current or max is undefined')

    return Math.floor((+current! / +max!) * 100)
  }

  private objectIDsToPrinterInfo(varbinds: Varbind[]): PrinterInfo {
    const snmpInfo = this.deBufferizeVarbinds(varbinds)

    const { objectIds }: PrinterObjectIds =
      objectIdsRepository.getPrinterObjectIds(this.printer.model)

    const printerInfo: PrinterInfo = {
      serialNumber: snmpInfo.find(x => x.oid === objectIds.serialNumber)
        ?.value as string,
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
}
