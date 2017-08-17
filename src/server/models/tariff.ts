import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ITariff extends Document {
    tag: string;
    body: string;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    name: String,
    description: String,
    price: Number,

});

const Tariff = model<ITariff>('Tariff', schema);

export = Tariff;
