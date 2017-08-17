import * as User from '../../models/user';
import * as _ from 'lodash';
import * as validate from '../../services/validateToken';
import * as asyncBusboy from 'async-busboy';

const fs = require('fs');

const crud = {

    updateInfo: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const user = JSON.parse(ctx.request.body.user);
            ctx.body = await User.update({ _id: user._id }, user);
        } else {
            ctx.status = 401;
        }

        await next();
    },

    getReferers: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await User.find({ 'parent': ctx.params.userId}).select('-passwordHash -salt');
        } else {
            ctx.status = 401;
        }

        await next();
    },

    getBalance: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const user = await User.findById(ctx.params.userId)
                .select('-passwordHash -salt')
                .populate('siteBalances.siteId');

            const balances = [];
            _.forEach(user.siteBalances, (value: any) => {
                balances.push({
                    balance: value.balance,
                    siteName: value.siteId.name,
                    siteId: value.siteId._id,
                    logo: value.siteId.photo.mini.url,
                });
            });
            ctx.body = balances;
        } else {
            ctx.status = 401;
        }
        await next();
    },

    attachPhoto: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const { files } = await asyncBusboy(ctx.req);
            const user = await User.findById(ctx.params.userId);
            const attached = await new Promise(resolve => {
                user.attach('photo', files[0], function (res) {
                    resolve();
                });
            });
            ctx.body = await user.save();
            fs.unlink(files[0].path, (err) => { });

        } else {
            ctx.status = 401;
        }
        await next();
    },

    changeTariff: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const user = await User.findById(ctx.params.userId);
            const tariff = ctx.request.body;
            user.tariff = tariff;
            await user.save();
            ctx.body = {};

        } else {
            ctx.status = 401;
        }
        await next();
    },
};

export default crud;
