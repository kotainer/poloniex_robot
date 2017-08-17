import {Document, model, Model, Schema} from 'mongoose';
import * as User from './user';
import * as _ from 'lodash';

const uuid = require('uuid');

interface IRequest extends Document {
    siteId: string;
    userId: string;
    status: string;
    number: string;
    date: Date;
    value: number;
}

const requestSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    userId: {
        type: String,
        ref: 'User',
        default: null
    },

    siteId: {
        type: String,
        ref: 'Site',
        default: null
    },

    value: Number,

    number: String,

    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },

    date: {
        type: Date,
        default: Date.now()
    },

});

requestSchema.pre('save', function (next) {
    if (this.isNew) {
        this.number = makeid();
    } else {
        next();
    }
});



function makeid() {
    let text = 'R_';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const Request = model<IRequest>('Request', requestSchema);

export = Request;
