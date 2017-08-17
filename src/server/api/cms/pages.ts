const pug = require('pug');
const appRootDir = require('app-root-dir').get();

import * as User from '../../models/user';
import * as Log from '../../models/log';
import * as Page from '../../models/page';
import * as Menu from '../../models/siteMenu';

import * as mongoose from 'mongoose';
import * as validate from '../../services/validateToken';
import { Crud } from '../crud-service';

export class AdminPages extends Crud {

    async main (ctx, next) {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await pug.renderFile(appRootDir + '/views/cms/index.pug');
        await next();
    };

};
