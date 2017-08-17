import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface INotify extends Document {
    tag: string;
    body: string;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    tag: String,

    userId: {
        type: String,
        ref: 'User',
        default: null
    },

    notify: {
        referals: {
            type: Number,
            default: 0,
        },
        orders: {
            type: Number,
            default: 0,
        },
        payments: {
            type: Number,
            default: 0,
        },
        gifts: {
            type: Number,
            default: 0,
        },
        requests: {
            type: Number,
            default: 0,
        },
    },

    dateUpdate: {
        type: Date,
        default: Date.now()
    },

});

const Notify = model<INotify>('Notify', schema);

export = Notify;
