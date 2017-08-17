import * as User from '../../models/user';
import * as Site from '../../models/site';
import * as Log from '../../models/log';
import * as Order from '../../models/order';
import * as Payment from '../../models/payment';
import * as Accrual from '../../models/accrual';
import * as Notify from '../../models/notification';
import appServer from '../../server';

import * as validate from '../../services/validateToken';

const crud = {

    getSiteOrders: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const site = await Site.findById(ctx.params.siteId);
            ctx.body = await Order.find({ siteId: site._id }).populate('userId siteId').sort('-date');
        } else {
            ctx.status = 401;
        }
        await next();
    },

    getUserOrders: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Order.find({ userId: ctx.params.userId }).populate('siteId').sort('-date');
        } else {
            ctx.status = 401;
        }
        await next();
    },

    updateOrder: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const order = JSON.parse(ctx.request.body.order);
            ctx.body = await Order.update({ _id: order._id }, { status: order.status });

            if (order.status === 'approved') {
                Log.create({
                    tag: 'approverOrder',
                    action: `Подтверждение заказа №${order.number}`,
                    sender: order.userId._id,
                    more: JSON.stringify(order)
                }, () => { });
                Accrual.create({
                    userId: order.userId._id,
                    siteId: order.siteId._id,
                    shopOrderId: order.shopOrderId,
                    value: order.target.payments.execute,
                    description: `Начисление по акции '${order.target.name}' при заказе №${order.number}`
                });
                await Notify.update(
                    { userId: order.userId._id },
                    {$inc: {'notify.payments': 1} });
                appServer.socketServer.updateNotifyStatus(order.userId._id);
                appServer.socketServer.notifyClient(order.userId._id,
                    { title: 'Новое начисление', body: `на сумму: ${order.target.payments.execute}` });
            }
        } else {
            ctx.status = 401;
        }
        await next();
    },

};
export default crud;
