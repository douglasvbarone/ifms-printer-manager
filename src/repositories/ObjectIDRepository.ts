export type PrinterObjectIds = {
  model: string
  objectIds: {
    model: string
    serialNumber: string
    counter: string
    location: string
    toners: {
      black: {
        current: string
        max: string
        model: string
      }
      cyan?: {
        current: string
        max: string
        model: string
      }
      magenta?: {
        current: string
        max: string
        model: string
      }
      yellow?: {
        current: string
        max: string
        model: string
      }
    }
  }
}

const objectIds: PrinterObjectIds[] = [
  {
    model: 'ECOSYS M3655idn',
    objectIds: {
      model: '1.3.6.1.2.1.25.3.2.1.3.1',
      serialNumber: '1.3.6.1.2.1.43.5.1.1.17.1',
      counter: '1.3.6.1.4.1.1347.43.10.1.1.12.1.1',
      location: '1.3.6.1.2.1.1.6.0',
      toners: {
        black: {
          current: '1.3.6.1.2.1.43.11.1.1.9.1.1',
          max: '1.3.6.1.2.1.43.11.1.1.8.1.1',
          model: '1.3.6.1.2.1.43.11.1.1.6.1.1'
        }
      }
    }
  },
  {
    model: 'ECOSYS P6235cdn',
    objectIds: {
      model: '1.3.6.1.2.1.25.3.2.1.3.1',
      serialNumber: '1.3.6.1.2.1.43.5.1.1.17.1',
      counter: '1.3.6.1.4.1.1347.43.10.1.1.12.1.1',
      location: '1.3.6.1.2.1.1.6.0',
      toners: {
        black: {
          current: '1.3.6.1.2.1.43.11.1.1.9.1.4',
          max: '1.3.6.1.2.1.43.11.1.1.8.1.4',
          model: '1.3.6.1.2.1.43.11.1.1.6.1.4'
        },
        cyan: {
          current: '1.3.6.1.2.1.43.11.1.1.9.1.1',
          max: '1.3.6.1.2.1.43.11.1.1.8.1.1',
          model: '1.3.6.1.2.1.43.11.1.1.6.1.1'
        },
        magenta: {
          current: '1.3.6.1.2.1.43.11.1.1.9.1.2',
          max: '1.3.6.1.2.1.43.11.1.1.8.1.2',
          model: '1.3.6.1.2.1.43.11.1.1.6.1.2'
        },
        yellow: {
          current: '1.3.6.1.2.1.43.11.1.1.9.1.3',
          max: '1.3.6.1.2.1.43.11.1.1.8.1.3',
          model: '1.3.6.1.2.1.43.11.1.1.6.1.3'
        }
      }
    }
  },
  {
    model: 'ECOSYS M2040dn',
    objectIds: {
      model: '1.3.6.1.2.1.25.3.2.1.3.1',
      serialNumber: '1.3.6.1.2.1.43.5.1.1.17.1',
      counter: '1.3.6.1.4.1.1347.43.10.1.1.12.1.1',
      location: '1.3.6.1.2.1.1.6.0',
      toners: {
        black: {
          current: '1.3.6.1.2.1.43.11.1.1.9.1.1',
          max: '1.3.6.1.2.1.43.11.1.1.8.1.1',
          model: '1.3.6.1.2.1.43.11.1.1.6.1.1'
        }
      }
    }
  }
]

export class objectIdsRepository {
  private constructor() {}

  static getPrinterObjectIds(model: string): PrinterObjectIds {
    const printerObjectIds = objectIds.find(printer => printer.model === model)

    if (!printerObjectIds) throw new Error('Model not found')

    return printerObjectIds
  }
}
