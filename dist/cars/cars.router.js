"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const cars_model_1 = require("./cars.model");
class CarsRouter extends router_1.Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get('/veiculos', (req, resp, next) => {
            cars_model_1.Car.find().then(this.render(resp, next)).catch(next);
        });
        application.get('/veiculos/:id', (req, resp, next) => {
            cars_model_1.Car.findById(req.params.id).then(this.render(resp, next)).catch(next);
        });
        application.get('/veiculos/find/:q', (req, resp, next) => {
            switch (req.params.q) {
                case 'naovendidos':
                    cars_model_1.Car.find({ 'vendido': false }).count((err, count) => {
                        if (err) {
                            resp.send(500, err);
                        }
                        if (count) {
                            resp.send(200, { 'não vendidos': count });
                        }
                        return next();
                    });
                    break;
                case 'quantidadespormarca':
                    const getQuantidadeMarca = () => __awaiter(this, void 0, void 0, function* () {
                        const marcas = ['Ford', 'Fiat', 'Honda'];
                        let distMarcas = [];
                        const promises = marcas.map((value) => __awaiter(this, void 0, void 0, function* () {
                            yield cars_model_1.Car.find({ 'marca': value }).count((err, count) => {
                                if (err) {
                                    resp.send(500, err);
                                }
                                if (count) {
                                    distMarcas.push({ marca: value, quantidade: count });
                                }
                            });
                        }));
                        yield Promise.all(promises);
                        return distMarcas;
                    });
                    getQuantidadeMarca().then((value) => {
                        resp.send(200, value);
                    }).catch(next);
                    return next();
                default:
                    resp.send(404);
                    return next();
            }
        });
        application.post('/veiculos', (req, resp, next) => {
            let car = new cars_model_1.Car(req.body);
            car.save().then(this.render(resp, next)).catch(next);
        });
        application.put('/veiculos/:id', (req, resp, next) => {
            const options = { overwrite: true };
            cars_model_1.Car.update({ _id: req.params.id }, req.body, options)
                .exec().then(result => {
                if (result.n) {
                    return cars_model_1.Car.findById(req.params.id).exec();
                }
                else {
                    resp.send(404);
                }
            }).then(this.render(resp, next)).catch(next);
        });
        application.patch('/veiculos/:id', (req, resp, next) => {
            const option = { new: true };
            cars_model_1.Car.findByIdAndUpdate(req.params.id, req.body, option)
                .then(this.render(resp, next)).catch(next);
        });
        application.del('/veiculos/:id', (req, resp, next) => {
            cars_model_1.Car.remove({ _id: req.params.id }).exec().then((cmdResult) => {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    resp.send(404);
                }
                return next();
            }).catch(next);
        });
    }
}
exports.carsRouter = new CarsRouter();
