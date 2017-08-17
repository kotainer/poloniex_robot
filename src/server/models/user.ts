import {Document, model, Model, Schema} from 'mongoose';
import * as crate from 'mongoose-crate';
import * as LocalFS from 'mongoose-crate-localfs';
import * as ImageMagick from 'mongoose-crate-imagemagick';
import * as Site from './site';

import crypto = require('crypto');

const appRootDir = require('app-root-dir').get();
const uuid = require('uuid');

interface Balances {
  siteId: string;
  balance: number;
}

interface IUser extends Document {
  name: string;
  lastame: string;
  surname: string;
  sex: string;
  dob: Date;
  email: string;
  login: string;
  phone: string;
  city: string;
  isBuisnessOwner: boolean;
  isActiveBuisness: boolean;
  isInvite: boolean;
  requisites: Object;
  balance: number;
  siteBalances: [Balances];
  qualification: any;
  subscribeCompanies: any;
  passwordHash: string;
  salt: string;
  parent: string;
  photo: any;
  tariff: any;
  siteId: any;

  checkPassword(password: string): boolean;
  attach(field: string, file: any, callback: any): any;
}

const userSchema = new Schema({
  _id: {
    type: String,
    default: uuid,
  },
  name: String,
  lastname: String,
  surname: String,
  dob: Date,
  phone: String,
  city: String,

  // for buisness
  actualName: String,
  actualAddress: String,

  requisites: {
    currency: {
      type: String,
      default: 'рубли'
    },
    inn: String,
    legalName: String,
    legalAddress: String,
    kpp: String,
    paymentAccount: {
      type: Number,
      validate: {
        validator: function (v) {
          return /4\d{19}/.test(v);
        },
        message: 'некоректный номер счёта'
      }
    },
    bik: {
      type: Number,
      validate: {
        validator: function (v) {
          return /04\d{7}/.test(v);
        },
        message: 'некоректный БИК'
      }
    },
    bankName: String,
    correspondentAccount: String
  },


  email: {
    type: String,
    required: 'Укажите e-mail',
    unique: 'Такой e-mail уже существует'
  },

  login: {
    type: String,
    required: 'Укажите логин',
    unique: 'Такой логин уже существует'
  },

  sex: {
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },

  parent: {
    type: String,
    ref: 'User',
    default: null
  },

  // Владелец бизнеса, открывает доступ к ЛК
  isBuisnessOwner: {
    type: Boolean,
    default: false
  },

  isActiveBuisness: {
    type: Boolean,
    default: false
  },

  isInvite: {
    type: Boolean,
    default: false
  },

  isBanned: {
    type: Boolean,
    default: false
  },

  bannedTo: {
    type: Date,
    default: 0
  },

  balance: {
    type: Number,
    default: 0
  },

  siteId: {
    type: String,
    ref: 'Site',
    default: null
  },

  tariff: {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    priceDay: {
      type: Number,
    }
  },

  siteBalances: [{
    siteId: {
      type: String,
      ref: 'Site',
      default: null
    },
    balance: {
      type: Number,
      default: 0
    }
  }],

  qualification: {
    qualify: {
      type: Number,
      default: 0
    },
    ownFound: {
      type: Number,
      default: 0
    },
    networkFound: {
      type: Number,
      default: 0
    }
  },

  registryDate: {
    type: Date,
    default: Date.now()
  },

  subscribeCompanies: [],

  passwordHash: String,
  salt: String,
});

userSchema.plugin(crate, {
  storage: new LocalFS({
    directory: appRootDir + '/public/photos/users/',
    webDirectory: '/photos/users/'
  }),
  fields: {
    photo: {
      processor: new ImageMagick({
        tmpDir: appRootDir + '/tmp', // Where transformed files are placed before storage, defaults to os.tmpdir()
        formats: ['JPEG', 'GIF', 'PNG'], // Supported formats, defaults to ['JPEG', 'GIF', 'PNG', 'TIFF']
        transforms: {
          original: {
            // keep the original file
          },
          small: {
            resize: '75x75',
          },
          medium: {
            resize: '175x175',
          },
        }
      })
    }
  }
});

userSchema.pre('save', function (next) {
  if (this.isNew && this.isBuisnessOwner) {
    this.tariff.name = 'не выбран';
    this.tariff.price = 0;

    Site.create({
      userId: this._id
    }, (err, site) => {
      this.siteId = site._id;
      site.attach('photo', {path: `${appRootDir}/public/images/default.png`}, function (res) {
          site.save();
          next();
      });
    });
  } else {
    next();
  }

});

userSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1');
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })

  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  if (!password) {
    return false;
  }
  if (!this.passwordHash) {
    return false;
  }
  return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const User = model<IUser>('User', userSchema);

export = User;
