import * as mongoose from "mongoose";

export interface Car extends mongoose.Document{
    veiculo: string,
    marca: string,
    ano: number,
    descricao: string,
    vendido: boolean,
    created: Date,
    updated: Date,
}

const carSchema = new mongoose.Schema({
    veiculo:{
        type: String
    },
    marca:{
        type: String,
    },
    ano:{
        type: Number,
    },
    descricao:{
        type: String,
    },
    vendido:{
        type: Boolean,
    },
    created:{
        type: Date,
    },
    updated:{
        type: Date,
    }
})

export const Car = mongoose.model<Car>('Car', carSchema)