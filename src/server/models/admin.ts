import {Document, model, Model, Schema} from 'mongoose';
import * as crate from 'mongoose-crate';
import * as LocalFS from 'mongoose-crate-localfs';
import * as ImageMagick from 'mongoose-crate-imagemagick';

import crypto = require('crypto');

const appRootDir = require('app-root-dir').get();
const uuid = require('uuid');

interface IAdmin extends Document  {
  name: string;
  email: string;
  login: string;
  passwordHash: string;
  salt: string;
  photo: any;

  checkPassword(password: string): boolean;
  attach(field: string, file: any, callback: any): any;
}

const adminSchema = new Schema({
  _id: {
    type: String,
    default: uuid,
  },

  name: String,

  login: {
    type: String,
    required: 'Укажите логин',
    unique: 'Такой логин уже существует'
  },

  email: {
    type: String,
    required: 'Укажите e-mail',
    unique: 'Такой e-mail уже существует'
  },

  registryDate: {
    type: Date,
    default: Date.now()
  },

  passwordHash: String,
  salt: String,
});

adminSchema.plugin(crate, {
  storage: new LocalFS({
    directory: appRootDir + '/public/photos/admins/',
    webDirectory: '/photos/admins/'
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
            format: '.jpg'
          },
          medium: {
            resize: '175x175',
            format: '.jpg'
          },
        }
      })
    }
  }
});

adminSchema.virtual('password')
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

adminSchema.methods.checkPassword = function (password) {
  if (!password) {
    return false;
  }
  if (!this.passwordHash) {
    return false;
  }
  return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1') == this.passwordHash;
};

const Admin = model<IAdmin>('Admin', adminSchema);

export = Admin;
