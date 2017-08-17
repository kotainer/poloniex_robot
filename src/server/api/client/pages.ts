const pug = require('pug');
const appRootDir = require('app-root-dir').get();

import * as Site from '../../models/site';
import * as Promo from '../../models/promo';
import * as User from '../../models/user';
import * as Log from '../../models/log';

const crud = {
    landing: async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await pug.renderFile(appRootDir + '/views/client/index.pug');
        await next();
    },

    openSite: async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        const _site = await Site.findOne({ id: ctx.params.siteId });
        if (_site) {
            const _user = await User.findById(ctx.query.user);
            if (_user) {
                ctx.cookies.set('_sarafan', _user._id, {
                    httpOnly: false,
                    expires: new Date(new Date().setDate(new Date().getDate() + 3)),
                    domen: '.sarafan.online'
                });

                if (ctx.query.source) {
                    ctx.cookies.set('_sarafan_source', ctx.query.source, {
                        httpOnly: false,
                        expires: new Date(new Date().setDate(new Date().getDate() + 3)),
                        domen: '.sarafan.online'
                    });
                }

                ctx.cookies.set('_sarafan_redirect_url', `http://${_site.url}`, {
                    httpOnly: false,
                    expires: new Date(new Date().setDate(new Date().getDate() + 3)),
                    domen: '.sarafan.online'
                });

                ctx.status = 200;
                ctx.body = await pug.renderFile(appRootDir + '/views/client/redirect.pug');

                Log.create({
                    tag: 'openSite',
                    action: 'Переход на сайт',
                    sender: ctx.params.siteId,
                    more: JSON.stringify(ctx.query)
                }, () => { });

            } else {
                ctx.status = 404;
                ctx.body = 'Битая ссылка';
            }

        } else {
            ctx.status = 404;
            ctx.body = 'SITE NOT FOUND';
        }
        await next();
    },

    openPromo: async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        const _promo = await Promo.findOne({ _id: ctx.params.promoId });
        if (_promo) {
            const _user = await User.findById(ctx.query.user);
            if (_user) {
                ctx.cookies.set('_sarafan', _user._id, {
                    httpOnly: false,
                    expires: new Date(new Date().setDate(new Date().getDate() + 3)),
                    domen: '.sarafan.online'
                });

                if (ctx.query.source) {
                    ctx.cookies.set('_sarafan_source', ctx.query.source, {
                        httpOnly: false,
                        expires: new Date(new Date().setDate(new Date().getDate() + 3)),
                        domen: '.sarafan.online'
                    });
                }

                ctx.cookies.set('_sarafan_redirect_url', `${_promo.url}`, {
                    httpOnly: false,
                    expires: new Date(new Date().setDate(new Date().getDate() + 3)),
                    domen: '.sarafan.online'
                });

                ctx.status = 200;
                ctx.body = await pug.renderFile(appRootDir + '/views/client/redirect.pug');

                Log.create({
                    tag: 'openSite',
                    action: 'Переход на сайт по акции',
                    sender: ctx.params.promoId,
                    more: JSON.stringify(ctx.query)
                }, () => { });

            } else {
                ctx.status = 404;
                ctx.body = 'Битая ссылка';
            }

        } else {
            ctx.status = 404;
            ctx.body = 'SITE NOT FOUND';
        }

        await next();
    },

    showSite: async (ctx, next) => {
        let referer = ctx.request.header.referer;
        referer = referer.replace('https://', '');
        referer = referer.replace('http://', '');
        referer = referer.split('/')[0];
        const site: any = await Site.findOne({url: new RegExp(referer, 'i')}).lean();
        ctx.redirect('http://sarafan.online/company/' + site._id);
    }

};
export default crud;
