const mongoose = require('mongoose');
const config = require('config');
const uuid = require('uuid');
mongoose.Promise = global.Promise;
mongoose.connect(config.get('db'));

import * as Admin from '../models/admin';
import * as Settings from '../models/settings';

const baseInitiDB = async () => {
    // ADMIN
    let admin = await Admin.findOne({login: 'admin'});
    if (!admin) {
        admin = await Admin.create({
            _id: uuid(),
            login: 'admin',
            password: 'lady8ug',
            email: 'admin',
        });
    }
    // ----------------------------------

    // SETTINGS
    let settings = await Settings.findOne({tag: 'main'});
    if (!settings) {
        settings = await Settings.create({
            _id: uuid(),
            tag: 'main',
        });
    }

    let settingsPayment = await Settings.findOne({tag: 'payments'});
    if (!settingsPayment) {
        settingsPayment = await Settings.create({
            _id: uuid(),
            tag: 'payments',
        });
    }
    // ----------------------------------

    mongoose.connection.close();
    console.log('default init complite');
};

baseInitiDB();
