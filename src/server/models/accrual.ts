import {Document, model, Model, Schema} from 'mongoose';
import * as User from './user';
import * as _ from 'lodash';

const uuid = require('uuid');

interface IAccrual extends Document {
    targetId: string;
    userId: string;
    date: Date;
    value: string;
}

const accrualSchema = new Schema({
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

    shopOrderId: {
        type: String,
        default: ''
    },

    value: Number,

    description: String,

    number: String,

    createdDate: {
        type: Date,
        default: Date.now()
    },

});

accrualSchema.pre('save', function (next) {
    if (this.isNew) {
        this.number = makeid();
        User.findById(this.userId, (err, user) => {
            let isExist = false;
            _.forEach(user.siteBalances, (value) => {
                if (value.siteId === this.siteId) {
                    value.balance += this.value;
                    isExist = true;
                }
            });
            if (!isExist) {
                user.siteBalances.push({
                    siteId: this.siteId,
                    balance: this.value
                });
            }

            user.save();
            next();
        });
    } else {
        next();
    }
});

function makeid() {
    let text = 'A_';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const Accrual = model<IAccrual>('Accrual', accrualSchema);

export = Accrual;
