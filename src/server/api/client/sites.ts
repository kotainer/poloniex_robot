import * as User from '../../models/user';
import * as Site from '../../models/site';
import * as Log from '../../models/log';
import * as Order from '../../models/order';
import * as Notify from '../../models/notification';
import appServer from '../../server';

import * as _ from 'lodash';
import * as validate from '../../services/validateToken';

import * as asyncBusboy from 'async-busboy';

const fs = require('fs');


const crud = {

    getSite: async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await Site.findById(ctx.params.id);
        await next();
    },

    getSiteTargets: async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await Site.findOne({ id: ctx.params.siteId }).select('targets -_id');
        await next();
    },

    updateSiteInfo: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const site = JSON.parse(ctx.request.body.site);
            ctx.body = await Site.update({ _id: site._id }, site);
        } else {
            ctx.status = 401;
        }
        await next();
    },

    executionHeader: async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', `${ctx.headers.origin}`);
        ctx.set('Access-Control-Allow-Headers', 'Content-Type');
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.set('Access-Control-Allow-Methods', 'POST');
        await next();
    },

    executionTarget: async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', `${ctx.headers.origin}`);
        ctx.set('Access-Control-Allow-Headers', 'Content-Type');
        ctx.set('Access-Control-Allow-Methods', 'POST');
        ctx.set('Access-Control-Allow-Credentials', 'true');

        const newOrder = ctx.request.body;

        let target = await Site.findOne(
            {
                'targets.id': newOrder.targetId
            }, {
                'targets': { $elemMatch: { 'id': newOrder.targetId } },
                'userId': 1,
            });

        if (! target) {
            return ctx.body = {error: '404'};
        }

        const siteOwnerId = target.userId;

        target = target.targets[0];
        newOrder.target = target;

        const userId = ctx.cookies.get('_sarafan');
        if (userId) {
            newOrder.userId = userId;
            newOrder.source = ctx.cookies.get('_sarafan_source');
            ctx.body = await Order.create(newOrder);

            await Notify.update(
                { userId: newOrder.userId },
                {$inc: {'notify.orders': 1} });
            appServer.socketServer.notifyClient(newOrder.userId,
                { title: 'Новый заказ', body: `на сумму: ${newOrder.value}` });
            appServer.socketServer.updateNotifyStatus(newOrder.userId);

            await Notify.update(
                { userId: siteOwnerId },
                {$inc: {'notify.orders': 1} });
            appServer.socketServer.notifyClient(siteOwnerId,
                { title: 'Новый заказ', body: `на сумму: ${newOrder.value}` });
            appServer.socketServer.updateNotifyStatus(siteOwnerId);

            Log.create({
                tag: 'executionTarget',
                action: 'Выполнение цели',
                sender: ctx.cookies.get('_sarafan'),
                more: JSON.stringify(ctx.request.body)
            }, () => { });
        } else {
            ctx.body = {status: 'cookies not contains userId'};
        }
        await next();
    },

    attachPhoto: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const { files } = await asyncBusboy(ctx.req);
            const site = await Site.findById(ctx.params.siteId);
            const attached = await new Promise(resolve => {
                site.attach('photo', files[0], function (res) {
                    resolve();
                });
            });
            ctx.body = await site.save();
            fs.unlink(files[0].path, (err) => { });

        } else {
            ctx.status = 401;
        }
        await next();
    },

};

export default crud;
