import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ILoan extends Document {
    slug: string;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    rate: Number,
    amount: Number,
    range: Number,
    coin: String,
    status: {
        type: String,
        enum: [
            'in_progress',
            'returned'
        ],
        default: 'in_progress'
    },

    endedDate: {
        type: Date,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },

});

const MyLoan = model<ILoan>('MyLoan', schema);

export = MyLoan;
