import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IChat extends Document  {
    slug: string;
}

const schema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    slug: String,

    messages: [{
        userId: String,
        message: String,
        createdDate: {
            type: Date,
            default: Date.now(),
        },
    }],

    users: [],

    isHaveNew: [],

    createdDate: {
        type: Date,
        default: Date.now(),
    },

});

const Chat = model<IChat>('Chat', schema);

export = Chat;
