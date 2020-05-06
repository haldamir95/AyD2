import { Server } from '../server'
import { routerV1 as esbRouter } from '../../routers/esb-router'
import { fetchQuery } from '../../request-manager'
import { esbcontroller } from '../../controllers/esb-controller'
import { lineReader } from '../../line-reader'

class EsbServer extends Server{

    constructor () {
        super(3003)
        super.routers(esbRouter)
        this.menuMsn = '------ Ordenes sin procesar ------'
        this.consoleMsn = '------------ Esperando transaccion ----------\n'
    }

    async mostrarTransacciones(){
        console.log('Se recibio orden de un cliente\n')
        console.log(esbcontroller.orders[esbcontroller.orders.length-1])
    }

    async start () {
        console.log(this.consoleMsn)
        //this.mostrarTransacciones()
        
    }


}

//exportando
export const esbServer = new EsbServer()