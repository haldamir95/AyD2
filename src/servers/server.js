import * as express from 'express'

export class Server {
  constructor (port) {
    this.port = port
    this.app = express.default()
    this.app.use(express.json())
  }

  routers (route) {
    this.app.use(route)
  }

  listen () {
    this.app.listen(this.port, () => {
    })
  }
}
