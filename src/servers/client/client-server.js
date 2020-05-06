import { lineReader } from '../../line-reader'
import { fetchQuery } from '../../request-manager'
//import { configuration } from '../../config/config'
import { Server } from '../server'
import { routerV1 as routerclient } from '../../routers/client-router'

var amqp = require('amqplib/callback_api');
// Código de operación, define el tipo de transacción y puede ser uno de los siguientes
// 01, retiro
// 02, depósito
// 03, compra en POS
// 04, compra en internet
// Número de tarjeta
// Monto de la operación
// Fecha y hora
class ClientServer extends Server {
  constructor () {
    super(3000)
    super.routers(routerclient)
    this.header = '###### ESCOJA EL TIPO DE TRANSACCION ######'
    this.footer = '######  GRACIAS, VUELVA PRONTO ######'
    this.oHeader = '------------------   PEDIDO   ------------------'
    this.oFooter = '------------------    FIN     ------------------'
    this.divider = '~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°~°'
    this.reqAns = '------------- Esperando  respuesta -------------'
    this.msn = 'Elegir una opción\n'
    this.tarjeta = 'Ingrese su no de tarjeta'
    this.monto = 'Ingrese el monto de la operacion'
    this.fecha = 'Ingrese la fecha y hora dd/mm/yy hh:mm'
    this.Options = {
      opt1: 'Retiro',
      opt2: 'Deposito',
      opt3: 'Compra en POS',
      opt4: 'Compra en Internet'
    }
    this.Data = {
      transaccion: '',
      tarjeta: '',
      monto: '',
      fecha: ''
    }
  }

 
  

    

  async start () {
    console.log(this.header)
    await this.showMenu()
    await this.guardarTransaccion()
    await this.guardarTarjeta()
    await this.guardarMonto()
    await this.guardarHora()
    console.log('\n SU ORDEN ES LA SIGUIENTE \n')
    this.printOrder()
    console.log('\n')

    if (await lineReader.askYesNoQuestion()) {
      await this.enviarTransaccion()
      await this.start()
    } else {
      console.log('Orden cancelada...')
    }

  }


  async showMenu () {
    console.log(this.divider)
    console.log(0, 'Terminar orden')
    Object.keys(this.Options).forEach((el, idx) => console.log(idx + 1, this.Options[el]))
    console.log(this.divider)
  }


  async guardarTransaccion () {
    let option = -1
    const max = Object.keys(this.Options).length
    option = await lineReader.askNumericQuestion(this.msn)
    if (option > max || option < 0) { 
      console.log('Opción inválida'); 
    }else{
      const key = Object.keys(this.Options)[option - 1]
      this.Data.transaccion = option
    }
  }
  

  async guardarTarjeta () {
    const tarj = await lineReader.askQuestion('Ingrese No de Tarjeta: ')
    this.Data.tarjeta = tarj
  }


  async guardarMonto () {
    const mont = await lineReader.askQuestion('Ingrese el Monto de la operacion Q. ')
    this.Data.monto = mont
  }


  async guardarHora () {
    const fech = await lineReader.askQuestion('Ingrese la Fecha ')
    this.Data.fecha = fech
  }



  printOrder () {
    console.log(this.oHeader)
    console.log(this.Data)
    console.log(this.oFooter)
  }


  printMsg(char1){
    switch(char1) {
      case 0:
        console.log('TRANSACCION APROBADA')      
        break;
      case 1:
        console.log('NO HAY FONDOS')
        break;
      case 2:
        console.log('ERROR EN EL BANCO')
        break;
      case 3:
        console.log('TIMEOUT')
        break;
    }
  }



  //enviar la orden al banco
  async enviarTransaccion() {
    console.log("ENVIAR TRANSACCION", this.Data)
    const info = this.Data;
    

    
    var char1 = this.Data.tarjeta.charAt(0);
    switch(char1) {
      case "1":
        console.log("Enviando al banco A puerto 3000")
        // await fetchQuery('http://18.188.14.222:3000/', 'POST', this.Data).then(res_be => {
        //   this.printMsg(res_be)
        // })     
        amqp.connect('amqp://3.21.165.119:5672', function(error0, connection) {
          if (error0) {
              throw error0;
          }
          connection.createChannel(function(error1, channel) {
              if (error1) {
                  throw error1;
              }
              var queue = 'task_queue';
              var msg = JSON.stringify(info);

              channel.assertQueue(queue, {
                  durable: true
              });
              channel.sendToQueue(queue, Buffer.from(msg), {
                  persistent: true
              });
              console.log(" [x] Sent '%s'", msg);
          });
          setTimeout(function() {
              connection.close();
              process.exit(0)
          }, 500);
      });   
        break;
      case "2":
        console.log("Enviando al banco B puerto 3001")
        await fetchQuery('http://18.188.14.222:3001/', 'POST', this.Data).then(res_be => {
          this.printMsg(res_be)
        })  
        break;
      case "3":
        console.log("Enviando al banco C puerto 3002")
        await fetchQuery('http://18.188.14.222:3002/', 'POST', this.Data).then(res_be => {
          this.printMsg(res_be)
        })  
        break;
      case "4":
        console.log("Enviando al banco D puerto 3003")
        await fetchQuery('http://18.188.14.222:3003/', 'POST', this.Data).then(res_be => {
          this.printMsg(res_be)
        })  
        break;
      case "5":
        console.log("Enviando al banco E puerto 3004")
        await fetchQuery('http://18.188.14.222:3004/', 'POST', this.Data).then(res_be => {
          this.printMsg(res_be)
        })  
        break;
      case "6":
        console.log("Enviando al banco F puerto 3005")
        await fetchQuery('http://18.188.14.222:3005/', 'POST', this.Data).then(res_be => {
          this.printMsg(res_be)
        })  
        break;
        default:
          console.log("Enviando al banco A puerto 3000")
          await fetchQuery('http://18.188.14.222:3000/', 'POST', this.Data).then(res_be => {
          this.printMsg(res_be)
        })  
        break;
    }



  }





 



}

export const clientServer = new ClientServer()









/*


 //enviar la orden al restaurante
 async placeOrder () {
  //envia la orden al puerto 3001 que es del restaurante y llama a /accept del router del reception-router
  const data = await fetchQuery('http://127.0.0.1:3003/acceptClient', 'POST', this.Data)
  console.log(`La orden se envió correctamente, pedido no. ${data.id}`)
}




//enviar la orden al motorista
async sendOrder () {
  //envia la orden al puerto 3002 que es del motorista y llama a /accept del router del biker-router
  const data = await fetchQuery('http://127.0.0.1:3002/accept', 'POST', this.Data)
  console.log(`La orden se envió correctamente, pedido no. ${data.id}`)
}










*/