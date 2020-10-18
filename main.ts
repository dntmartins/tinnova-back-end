
import {Server} from './server/server'
import {carsRouter} from "./cars/cars.router";

const server = new Server()
server.bootstrap([carsRouter]).then(server=>{
    console.log('Server is listening on : ', server.application.address())
}).catch(error=>{
    console.log('Server failed to start')
    console.log(error)
    process.exit(1)
})
