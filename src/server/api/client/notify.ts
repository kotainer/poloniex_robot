import * as Notify from '../../models/notification';
import * as validate from '../../services/validateToken';
import appServer from '../../server';

import { SarafanMailer } from '../../services/mailer';
const mailer = new SarafanMailer();

const crud = {

    getUserNotify: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            let notify: any = await Notify.findOne({ userId: ctx.params.userId });
            if (notify) {
                ctx.body = notify;
            } else {
                notify = new Notify({ userId: ctx.params.userId });
                ctx.body = await notify.save();
            }
        } else {
            ctx.status = 401;
        }
        await next();

    },

    updateUserNotify: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            appServer.socketServer.updateNotifyStatus(ctx.params.userId);
            const field = {};
            field[`notify.${ctx.request.body.tag}`] = 0;
            ctx.body = await Notify.update(
                { userId: ctx.params.userId }, field);

        } else {
            ctx.status = 401;
        }
        await next();
    },

    newQuestion: async (ctx, next) => {
        mailer.sendQuestionMail(ctx.request.body);

        ctx.body = {status: 'ok'};
        await next();
    },

};

export default crud;
