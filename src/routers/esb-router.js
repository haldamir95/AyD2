import * as express from 'express'
import { esbcontroller } from '../controllers/esb-controller'
import { fetchQuery } from '../request-manager'

export const routerV1 = express.Router()

class Esb{
    async acceptOrderFromClient (req, res) {
        const { address, ...order } = req.body
        esbcontroller.addOrder(order, address)
        console.log('### SE RECIBIO ORDEN DE UN CLIENTE ###')
        console.log(esbcontroller.orders[esbcontroller.orders.length-1],'\n')
        //enviando al Recepcion
        fetchQuery('http://127.0.0.1:3001/accept', 'POST', esbcontroller.orders[esbcontroller.orders.length-1]).then(res => {
            if (res.success) {
                console.log('### SE ENVIO ORDEN A RECEPCION ###')
            } else {
                console.log('No hay repartidores disponibles')
                receptioncontroller.changeStatus(index, 0)
            }
        })
        res.send({ success: true, id: esbcontroller.orderId })
    }



    async acceptOrderFromReception (req, res) {
        const { address, ...order } = req.body
        esbcontroller.addOrder(order, address)
        console.log('### SE RECIBIO ORDEN DE RECEPCION ###')
        console.log(esbcontroller.orders[esbcontroller.orders.length-1],'\n')
        //enviando al Biker
        fetchQuery('http://127.0.0.1:3002/accept', 'POST', esbcontroller.orders[esbcontroller.orders.length-1]).then(res => {
            if (res.success) {
                console.log('### SE ENVIO ORDEN A MOTORISTA ###')
            } else {
                console.log('No hay repartidores disponibles')
                receptioncontroller.changeStatus(index, 0)
            }
        })
        res.send({ success: true, id: esbcontroller.orderId })
    }

    
}

//rutas
const esb = new Esb()
routerV1.post('/acceptClient', esb.acceptOrderFromClient)
routerV1.post('/acceptReception', esb.acceptOrderFromReception)