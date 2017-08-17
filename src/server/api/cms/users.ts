const pug = require('pug');
const appRootDir = require('app-root-dir').get();

import * as User from '../../models/user';
import * as Log from '../../models/log';
import * as Page from '../../models/page';
import * as Menu from '../../models/siteMenu';
import * as Site from '../../models/site';

import * as mongoose from 'mongoose';
import * as validate from '../../services/validateToken';
import { Crud } from '../crud-service';

export class Users extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    async updateUserBanStatus (ctx, next) {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const bannedTo = 0;
            const isBanned = ctx.request.body.isBanned === 'true' ? true : false;
            console.log(isBanned);
            ctx.body = await User.update(
                {_id: ctx.params.id},
                {isBanned});
        } else {
            ctx.status = 401;
        }

        await next();
    };

    async removeUser (ctx, next) {
        if (await validate.validateToken(ctx.headers.authorization)) {
            await Site.remove({userId: ctx.params.id });
            ctx.body = await User.remove({_id: ctx.params.id });
        } else {
            ctx.status = 401;
        }

        await next();
    };

};
