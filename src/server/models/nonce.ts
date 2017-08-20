import {Document, model, Model, Schema} from 'mongoose';

interface INonce extends Document {
    count: any;
}

const schema = new Schema({
    _id: {
        type: String,
        default: 'nonce',
    },
    count: {
        type: Number,
        default: 0,
    },
});

const Nonce = model<INonce>('Nonce', schema);

export = Nonce;
