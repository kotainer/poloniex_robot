import * as Promo from '../../models/promo';
import * as Log from '../../models/log';
import * as User from '../../models/user';

import * as validate from '../../services/validateToken';
import * as asyncBusboy from 'async-busboy';

const appRootDir = require('app-root-dir').get();
const fs = require('fs');
import * as _ from 'lodash';

const crud = {

    getPromoList: async (ctx, next) => {
        const promos = await Promo.find({dateEnd: { $gte: Date() }}).populate('siteId').sort('-dateEnd');
        _.remove(promos, (promo) => {
            return promo.siteId.balance <= 0;
        });

        promos.forEach((promo) => {
            delete promo.siteId['balance'];
        });

        ctx.body = promos;
        await next();
    },

    getUserPromoList: async (ctx, next) => {
        const user: any = await User.findById(ctx.params.userId).lean();
        const promos = await Promo.find({
            dateEnd: { $gte: Date() },
            siteId: {
                $in: user.subscribeCompanies,
            },
        }).populate('siteId').sort('-dateEnd');

        _.remove(promos, (promo) => {
            if (!promo.siteId) {
                return true;
            }
            return !promo.siteId.isActiveBuisness;
        });

        ctx.body = promos;
        await next();
    },

    getSitePromoList: async (ctx, next) => {
        ctx.body = await Promo.find({ siteId: ctx.params.siteId }).sort('-dateEnd');
        await next();
    },

    addPromo: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const promo: any = await Promo.create(ctx.request.body);
            const createdPromo = await Promo.findById(promo._id);
            const attached = await new Promise(resolve => {
                createdPromo.attach('photo', {path: `${appRootDir}/public/images/default.png`}, function (err) {
                    resolve();
                });
            });
            ctx.body = await createdPromo.save();

        } else {
            ctx.status = 401;
        }
        await next();
    },

    showPromo: async (ctx, next) => {
        ctx.body = await Promo.findOne({_id: ctx.params.promoId}).populate('siteId');
        await next();
    },

    deletePromo: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Promo.remove({_id: ctx.params.promoId });

        } else {
            ctx.status = 401;
        }
        await next();
    },

    updatePromo: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const promo = JSON.parse(ctx.request.body.promo);
            ctx.body = await Promo.update({ _id: promo._id }, promo);
        } else {
            ctx.status = 401;
        }
        await next();
    },

    attachPhoto: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const { files } = await asyncBusboy(ctx.req);
            const promo = await Promo.findById(ctx.params.promoId);
            await new Promise(resolve => {
                promo.attach('photo', files[0], function (res) {
                    resolve();
                });
            });
            ctx.body = await promo.save();
            fs.unlink(files[0].path, (err) => { });

        } else {
            ctx.status = 401;
        }
        await next();
    },

    sharePromo: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            Log.create({
                tag: 'sharePromo',
                action: ctx.request.body.source,
                sender: ctx.request.body.sender,
                more: ctx.request.body.promoId,
            }, () => { });
            ctx.body = {};

        } else {
            ctx.status = 401;
        }
        await next();
    },

};

export default crud;
