import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ISettings extends Document {
    tag: string;
    body: string;
}

const setSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    tag: String,

    body: {},

    dateUpdate: {
        type: Date,
        default: Date.now()
    },

});

const Settings = model<ISettings>('Settings', setSchema);

export = Settings;