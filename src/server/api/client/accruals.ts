import * as Accrual from '../../models/accrual';

import * as validate from '../../services/validateToken';

const crud = {

    getSiteAccruals: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Accrual.find({ siteId: ctx.params.siteId }).populate('userId').sort('-date');

        } else {
            ctx.status = 401;
        }
        await next();

    },

    getUserAccruals: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Accrual.find({ userId: ctx.params.userId }).populate('siteId').sort('-date');

        } else {
            ctx.status = 401;
        }
        await next();

    },

};

export default crud;
