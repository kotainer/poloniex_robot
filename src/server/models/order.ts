import {Document, model, Model, Schema} from 'mongoose';
import * as Site from './site';
import * as User from './user';

const uuid = require('uuid');

interface IOrder extends Document  {
    targetId: string;
    userId: string;
    date: Date;
    value: string;
}

const orderSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    targetId: {
        type: String,
        default: ''
    },

    source: String,

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

    shopOrderId: {
        type: String,
        default: ''
    },

    number: String,

    value: String,

    userPayment: {
        paymentType: {
            type: String,
            default: 'money'
        },
        total: {
            type: Number,
            default: 0
        }
    },

    target: {
        id: String,
        name: String,
        attribute: String,
        payments: {
            execute: Number,
            newReferal: Number,
            referalBonusesLevel1: Number,
            referalBonusesLevel2: Number,
            referalBonusesLevel3: Number,
            referalBonusesLevel4: Number
        }
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },

    date: {
        type: Date,
        default: Date.now()
    },

    createdDate: {
        type: Date,
        default: Date.now()
    },

});

orderSchema.pre('save', function (next) {
    if (this.isNew) {
        this.number = makeid();
        Site.findOne({
            'targets.id': this.targetId
        }, (err, site) => {
            this.siteId = site._id;
            next();
        });
    } else {
        next();
    }
});

orderSchema.methods.awesomeMethods = function () {

};

function makeid() {
    let text = 'O_';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const Order = model<IOrder>('Order', orderSchema);

export = Order;
