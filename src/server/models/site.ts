import {Document, model, Model, Schema} from 'mongoose';
import * as crate from 'mongoose-crate';
import * as LocalFS from 'mongoose-crate-localfs';
import * as ImageMagick from 'mongoose-crate-imagemagick';

const appRootDir = require('app-root-dir').get();
const uuid = require('uuid');

interface ISite extends Document {
    id: any;
    name: string;
    attribute: string;
    userId: string;
    url: string;
    paymentType: object;
    targets: any;
    isActiveBuisness: boolean;

    attach(field: string, file: any, callback: any): any;
}

const siteSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },
    id: String,
    name: String,
    nick: String,
    logo: String,

    siteType: {
        type: String,
        default: 'shop'
    },

    url: {
        type: String,
        default: ''
    },

    isBonusProgramm: {
        type: Boolean,
        default: false
    },

    isActiveBuisness: {
        type: Boolean,
        default: false
    },

    paymentType: {
        nonCash: {
            type: Boolean,
            default: false
        },
        isOrder: {
            type: Boolean,
            default: false
        },
        isBonus: {
            type: Boolean,
            default: false
        },
        other: {
            type: Boolean,
            default: false
        },
        otherDescription: String
    },

    userId: {
        type: String,
        ref: 'User',
        default: null
    },

    targets: [{
        id: String,
        name: String,
        attribute: String,
        description: String,
        payments: {
            execute: Number,
            newReferal: Number,
            referalBonusesLevel1: Number,
            referalBonusesLevel2: Number,
            referalBonusesLevel3: Number,
            referalBonusesLevel4: Number
        }
    }],

    description: String

});

siteSchema.plugin(crate, {
    storage: new LocalFS({
        directory: appRootDir + '/public/photos/sites/',
        webDirectory: '/photos/sites/'
    }),
    fields: {
        photo: {
            processor: new ImageMagick({
                tmpDir: appRootDir + '/tmp',
                formats: ['JPEG', 'GIF', 'PNG'],
                transforms: {
                    original: {
                        // keep the original file
                    },
                    mini: {
                        resize: '35x35',
                    },
                    small: {
                        resize: '95x95',
                    },
                    medium: {
                        resize: '500x180',
                    }
                }
            })
        }
    }
});

siteSchema.pre('save', function (next) {
    if (this.isNew) {
        Site.count({}, (err, count) => {
            this.id = count + 1;
            next();
        });
    } else {
        next();
    }
});


const Site = model<ISite>('Site', siteSchema);

export = Site;
