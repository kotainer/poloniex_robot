import {Document, model, Model, Schema} from 'mongoose';

const uuid = require('uuid');

interface ISiteMenu extends Document {
    name: string;
    path: string;
    pageId: string;
    position: number;
    isVisible: boolean;
    isOpen: boolean;
    level: number;
    children: any;
}

const siteMenuSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },
    name: String,
    path: String,
    pageId: {
        type: String,
        ref: 'Page',
        default: null
    },
    position: Number,
    isVisible: {
        type: Boolean,
        default: true
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    level: {
        type: Number,
        default: 1
    },
    isMain: {
        type: Boolean,
        default: false
    },
    isEditable: {
        type: Boolean,
        default: true
    },
    children: []
});


const SiteMenu = model<ISiteMenu>('SiteMenu', siteMenuSchema);

export = SiteMenu;
