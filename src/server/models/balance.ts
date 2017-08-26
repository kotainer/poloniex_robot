import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IBalance extends Document {
    balance: number;
    coin: string;
    createdDate: any;
    dateString: string;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    balance: Number,
    coin: String,
    dateString: String,

    createdDate: {
        type: Date,
        default: Date.now(),
    },

});

schema.index({ balance: 1 });
schema.index({ createdDate: 1 });

const Balance = model<IBalance>('Balance', schema);

export = Balance;
