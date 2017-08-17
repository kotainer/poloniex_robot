import * as Payment from '../../models/payment';

import * as validate from '../../services/validateToken';

const crud = {

    getSitePayments: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Payment.find({ siteId: ctx.params.siteId }).populate('userId siteId').sort('-date');

        } else {
            ctx.status = 401;
        }
        await next();

    },

    getUserPayments: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Payment.find({ userId: ctx.params.userId }).populate('siteId').sort('-date');

        } else {
            ctx.status = 401;
        }
        await next();

    },

};

export default crud;
