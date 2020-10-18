"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const carSchema = new mongoose.Schema({
    veiculo: {
        type: String
    },
    marca: {
        type: String,
    },
    ano: {
        type: Number,
    },
    descricao: {
        type: String,
    },
    vendido: {
        type: Boolean,
    },
    created: {
        type: Date,
    },
    updated: {
        type: Date,
    }
});
exports.Car = mongoose.model('Car', carSchema);
