import {Document, model, Model, Schema} from 'mongoose';
import * as crate from 'mongoose-crate';
import * as LocalFS from 'mongoose-crate-localfs';
import * as ImageMagick from 'mongoose-crate-imagemagick';

const appRootDir = require('app-root-dir').get();
const uuid = require('uuid');

interface IPromo extends Document {
    id: string;
    siteId: any;
    url: string;
    targetId: string;
    name: string;
    dateStart: Date;
    dateEnd: Date;
    description: string;
    isVisible: boolean;

    attach(field: string, file: any, callback: any): any;
}

const promoSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },
    id: String,
    description: String,
    userDescription: String,
    video: String,
    url: String,
    name: String,

    siteId: {
        type: String,
        ref: 'Site',
        default: null
    },

    targetId: {
        type: String,
    },

    isVisible: {
        type: Boolean,
        default: true
    },

    dateStart: {
        type: Date,
        default: Date.now()
    },

    dateEnd: {
        type: Date
    },

    createdDate: {
        type: Date,
        default: Date.now()
    },

});

promoSchema.plugin(crate, {
    storage: new LocalFS({
        directory: appRootDir + '/public/photos/promo/',
        webDirectory: '/photos/promo/'
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
                    small: {
                        resize: '75x75',
                    }
                }
            })
        }
    }
});

const Promo = model<IPromo>('Promo', promoSchema);

promoSchema.pre('save', function (next) {
    if (this.isNew) {
        Promo.count({}, (err, count) => {
            this.id = count + 1;
            next();
        });
    } else {
        next();
    }

});

export = Promo;
