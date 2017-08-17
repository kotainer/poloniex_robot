import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IBill extends Document {
    sale: number;
    summ: number;
    sender: any;
    isPaymed: boolean;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    sale: {
        type: Number,
        default: 0,
    },

    summ: {
        type: Number,
        default: 0,
    },

    term: {
        type: Number,
        default: 0,
    },

    tariff: {
        name: {
            type: String,
        },
        price: {
            type: Number,
        },
        priceDay: {
            type: Number,
        }
    },

    sender: {
        type: String,
        ref: 'User',
        default: null
    },

    isPaymed: {
        type: Boolean,
        default: false,
    },

    createdDate: {
        type: Date,
        default: Date.now()
    },

});

schema.methods.awesomeMethods = function () {

};

const Bill = model<IBill>('Bill', schema);

export = Bill;
