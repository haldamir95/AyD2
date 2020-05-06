import * as express from 'express'

export const routerV1 = express.Router()

class ClientRouter {

  hola(req, res){
    res.send('te amor richie');
  } 

  async acceptOrder (req, res) {
    const { order } = req.body

    console.log(`No. de orden ${order}, recibido por cliente`)
    res.send({ received: true })
  }
}

const clientrouter = new ClientRouter()
routerV1.post('/accept', clientrouter.acceptOrder)
routerV1.get('/hola', clientrouter.hola)
