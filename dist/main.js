"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const cars_router_1 = require("./cars/cars.router");
const server = new server_1.Server();
server.bootstrap([cars_router_1.carsRouter]).then(server => {
    console.log('Server is listening on : ', server.application.address());
}).catch(error => {
    console.log('Server failed to start');
    console.log(error);
    process.exit(1);
});
