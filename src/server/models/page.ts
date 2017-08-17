import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface IPage extends Document {
    name: string;
    subName: string;
    path: string;
    boyd: string;
    updated: Date;
}

const pageSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },

    name: {
        type: String,
        default: ''
    },
    subName: {
        type: String,
        default: ''
    },
    // Калькулятор на странице
    calculatorType: {
        type: String,
        default: 'без',
    },
    // Тарифы на странице
    rateType: {
        type: String,
        default: 'без',
    },
    path: String,
    body: {
        type: String,
        default: ''
    },
    updated: {
        type: Date,
        default: Date.now()
    },
    isMain: {
        type: Boolean,
        default: false
    }
});


const Page = model<IPage>('Page', pageSchema);

export = Page;
