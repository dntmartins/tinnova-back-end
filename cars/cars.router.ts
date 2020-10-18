import { Router } from "../common/router";
import * as restify from "restify";
import { Car } from "./cars.model";

class CarsRouter extends Router{
    constructor(){
        super()
        this.on('beforeRender', document =>{
            document.password = undefined
        })
    }

    applyRoutes(application: restify.Server){
        application.get('/veiculos', (req, resp, next)=> {
            Car.find().then(this.render(resp, next)).catch(next)
        })

        application.get('/veiculos/:id', (req, resp, next)=>{
            Car.findById(req.params.id).then(this.render(resp, next)).catch(next)
        })

        application.get('/veiculos/find/:q', (req, resp, next)=>{
            switch(req.params.q){
                case 'naovendidos':
                    Car.find({'vendido':false}).count((err, count)=>{
                        if(err){
                            resp.send(500, err);
                        }
                        if(count){
                            resp.send(200, {'não vendidos' : count});
                        }
                        return next()
                    })
                    break;
                case 'quantidadespormarca':
                    const getQuantidadeMarca = async ()=>{
                        const marcas = ['Ford', 'Fiat', 'Honda'];
                        let distMarcas = [];
                        const promises = marcas.map(async (value)=>{
                            await Car.find({'marca':value}).count((err, count)=>{
                                if(err){
                                    resp.send(500, err);
                                }
                                if(count){
                                   distMarcas.push({marca : value, quantidade: count});
                                }
                            })
                        });
                        await Promise.all(promises);
                        return distMarcas;
                    };
                    getQuantidadeMarca().then((value)=>{
                        resp.send(200, value);
                    }).catch(next)
                    return next()
                default:
                    resp.send(404);
                    return next();
            }
        })

        application.post('/veiculos', (req, resp, next)=>{
            let car = new Car(req.body)
            car.save().then(this.render(resp, next)).catch(next)
        })

        application.put('/veiculos/:id', (req, resp, next)=>{
            const options = {overwrite: true}
            Car.update({_id:req.params.id}, req.body, options)
            .exec().then(result=>{
                if(result.n){
                    return Car.findById(req.params.id).exec()
                }else{
                    resp.send(404)
                }
            }).then(this.render(resp, next)).catch(next)
        })

        application.patch('/veiculos/:id', (req, resp, next)=>{
            const option = {new : true}
            Car.findByIdAndUpdate(req.params.id, req.body, option)
            .then(this.render(resp, next)).catch(next)
        })

        application.del('/veiculos/:id', (req, resp, next)=>{
            Car.remove({_id:req.params.id}).exec().then((cmdResult: any)=>{
                if(cmdResult.result.n){
                    resp.send(204)
                }else{
                    resp.send(404)
                }
                return next()
            }).catch(next)
        })
    }
}

export const carsRouter = new CarsRouter()