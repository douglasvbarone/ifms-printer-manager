import { Request, Response, Router } from 'express'
import { randomUUID } from 'crypto'
import log from '../log.js'

const router = Router()

export class EventsController {
  private static clients: { id: string; res: Response }[] = []

  static async eventsHandler(req: Request, res: Response) {
    /*
      If the server is behind a NGINX reverse proxy, use the following configuration on the server:
      proxy_read_timeout 24h;
    */
    const headers = {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no'
    }

    res.writeHead(200, headers)

    const clientId = randomUUID()

    const newClient = {
      id: clientId,
      res
    }

    EventsController.clients.push(newClient)

    log.info(new Date().toLocaleString(), `${clientId} Connection opened`)

    req.on('close', () => {
      log.info(new Date().toLocaleString(), `${clientId} Connection closed`)
      EventsController.clients = EventsController.clients.filter(
        client => client.id !== clientId
      )
    })
  }

  static async sendEvent(data: any = null) {
    this.clients.forEach(client => {
      log.info(
        new Date().toLocaleString(),
        `Sending event message to ${client.id}`
      )
      client.res.write(`event: message\n`)
      client.res.write(`data: ${JSON.stringify(data)}\n\n`)
    })
  }
}

router.get('/', EventsController.eventsHandler)

export default router
