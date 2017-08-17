import * as User from '../../models/user';
import * as Site from '../../models/site';
import * as Log from '../../models/log';

import { SarafanMailer } from '../../services/mailer';
const mailer = new SarafanMailer();

import * as _ from 'lodash';
import * as validate from '../../services/validateToken';

const crud = {

    sendInvite: async (ctx, next) => {
        mailer.sendInviteCompanyMail(ctx.request.body.email);
        ctx.body = {status: 'ok'};
        await next();
    },

    getList: async (ctx, next) => {
        const sites = await Site.find().select('-userId');
        _.remove(sites, (site) => {
            return site.targets.length <= 0;
        });
        ctx.body = sites;
        await next();
    },

    getCompanyReferer: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await User.find({
                subscribeCompanies: { $in: [ctx.params.companyId] }
            }).select('-passwordHash -salt -siteBalances -subscribeCompanies');
        } else {
            ctx.status = 401;
        }

        await next();
    },

    subscribe: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await User.update(
                { _id: ctx.request.body.userId, },
                {
                    $push: {
                        subscribeCompanies: ctx.request.body.companyId,
                    }
                }
            );

            Log.create({
                tag: 'subscribeCompany',
                action: 'Подписка на компанию',
                sender: ctx.request.body.userId,
                more: ctx.request.body.companyId,
            }, () => { });

        } else {
            ctx.status = 401;
        }

        await next();
    },

    unsubscribe: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const user = await User.findById(ctx.request.body.userId);
            user.subscribeCompanies = _.remove(user.subscribeCompanies, (n) => {
                return n !== ctx.request.body.companyId;
            });

            const result = await user.save();
            result.passwordHash = null;
            result.salt = null;
            result.siteBalances = null;

            ctx.body = result;

            Log.create({
                tag: 'unsubscribeCompany',
                action: 'Отписка от компании',
                sender: ctx.request.body.userId,
                more: ctx.request.body.companyId,
            }, () => { });

        } else {
            ctx.status = 401;
        }

        await next();
    }

};

export default crud;
