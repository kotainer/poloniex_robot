import * as Request from '../../models/request';
import * as User from '../../models/user';
import * as validate from '../../services/validateToken';

import * as _ from 'lodash';

const crud = {

    getSiteRequests: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Request.find({ siteId: ctx.params.siteId }).populate('userId').sort('-date');

        } else {
            ctx.status = 401;
        }

        await next();

    },

    getUserRequests: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Request.find({ userId: ctx.params.userId }).populate('siteId').sort('-date');

        } else {
            ctx.status = 401;
        }

        await next();

    },

    addUserRequests: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const _request = new Request(ctx.request.body);
            _request.number = makeid();

            const _user: any = await User.findById(_request.userId);
            const siteBalance: any = _.find(_user.siteBalances, { siteId: _request.siteId });
            siteBalance.balance -= _request.value;
            await _user.save();

            const request = new Request(_request);
            ctx.body = await request.save();
        } else {
            ctx.status = 401;
        }

        await next();

    },

};

function makeid() {
    let text = 'R_';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export default crud;
