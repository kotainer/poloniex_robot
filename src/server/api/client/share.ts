import * as Notify from '../../models/notification';
import * as validate from '../../services/validateToken';
import appServer from '../../server';

import { SarafanMailer } from '../../services/mailer';
const mailer = new SarafanMailer();

const crud = {

    login: async (ctx, next) => {
        ctx.body = {status: 'login'};
        await next();
    },

    checkLogin: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = { userId: '123456789' };
        } else {
            ctx.status = 401;
        }
        await next();
    },

    sharePage: async (ctx, next) => {
        ctx.body = {status: 'ok'};
        await next();
    },

};

export default crud;
