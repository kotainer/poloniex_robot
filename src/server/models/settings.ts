import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ISettings extends Document {
    tag: string;
    body: string;
    settings: any;
}

const setSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    tag: String,

    body: {},

    limitLoans: Number,
    averagePlus: Number,
    averageMinus: Number,
    minRate: Number,

    limitDASHInLoan: Number,
    maxDASHCount: Number,

    limitBTCInLoan: Number,
    maxBTCCount: Number,

    limitXRPInLoan: Number,
    maxXRPCount: Number,

    limitXMRInLoan: Number,
    maxXMRCount: Number,

    settings: {},

    dateUpdate: {
        type: Date,
        default: Date.now()
    },

});

const Settings = model<ISettings>('Settings', setSchema);

export = Settings;
