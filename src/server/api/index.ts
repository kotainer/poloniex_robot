import clientRouter from './client';
import pages from './client/pages';

import cmsRouter from './cms';
import { AdminPages } from './cms/pages';

const Router = require('koa-router');
const pagesCms = new AdminPages(null, null);

const clientIndexRouter = new Router();
clientIndexRouter
    .get('/', pagesCms.main)
    .get('/*', pagesCms.main)
    .get('/site/:siteId', pages.openSite)
    .get('/promo/:promoId', pages.openPromo)
    .get('/show/site', pages.showSite)
    ;


const cmsIndexRouter = new Router();
cmsIndexRouter
    .get('/cms', pagesCms.main)
    .get('/cms/*', pagesCms.main);

const combineRouters = require('koa-combine-routers');
const router = combineRouters([
    clientIndexRouter,
    clientRouter,
    cmsIndexRouter,
    cmsRouter
]);

export default router;
