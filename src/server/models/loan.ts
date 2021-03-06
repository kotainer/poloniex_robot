import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ILoan extends Document {
    rate: number;
    amount: number;
    rangeMin: number;
    rangeMax: number;
    coin: string;
    createdDate: any;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    rate: Number,
    amount: Number,
    rangeMin: Number,
    rangeMax: Number,
    coin: String,

    createdDate: {
        type: Date,
        default: Date.now(),
    },

});

schema.index({ rate: 1 });
schema.index({ createdDate: 1 });

const Loan = model<ILoan>('Loan', schema);

export = Loan;
