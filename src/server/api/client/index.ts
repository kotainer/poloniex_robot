import users from './users';
import auth from './auth';
import sites from './sites';
import pages from './pages';
import orders from './orders';
import promos from './promos';
import payments from './payments';
import companies from './companies';
import requests from './paymentsRequests';
import accruals from './accruals';
import notify from './notify';
import bills from './bills';
import externalShare from './share';

const Router = require('koa-router');
const router = new Router({ prefix: '/api' });

router
    // AUTH
    .get('/auth/validate', auth.validate)

    .post('/auth/login', auth.login)
    .post('/auth/register', auth.register)
    .post('/auth/restore', auth.restorePass)
    // ------------------------------------------------

    // USER
    .get('/user/:userId/referers', users.getReferers)
    .get('/user/:userId/balance', users.getBalance)

    .post('/user/:userId/attach', users.attachPhoto)
    .post('/user/:userId/tariff', users.changeTariff)

    .put('/user', users.updateInfo)
    // ------------------------------------------------

    // USER NOTIFY
    .get('/notify/:userId', notify.getUserNotify)

    .put('/notify/:userId', notify.updateUserNotify)
    // ------------------------------------------------

    // SITE
    .get('/site/:id', sites.getSite)
    .get('/site/:siteId/targets', sites.getSiteTargets)
    .get('/site/open/:siteId', pages.openSite)

    .put('/site', sites.updateSiteInfo)

    .post('/site/:siteId/attach', sites.attachPhoto)
    // ------------------------------------------------

    // TARGET
    .post('/target/execute', sites.executionTarget)

    .options('/target/execute', sites.executionHeader)
    // ------------------------------------------------

    // ORDER
    .get('/orders/user/:userId', orders.getUserOrders)
    .get('/orders/site/:siteId', orders.getSiteOrders)

    .put('/orders', orders.updateOrder)
    // ------------------------------------------------

    // ACCRUALS
    .get('/accruals/site/:siteId', accruals.getSiteAccruals)
    .get('/accruals/user/:userId', accruals.getUserAccruals)
    // ------------------------------------------------

    // PAYMENTS
    .get('/payments/site/:siteId', payments.getSitePayments)
    .get('/payments/user/:userId', payments.getUserPayments)
    // ------------------------------------------------

    // REQUSTS
    .get('/requests/site/:siteId', requests.getSiteRequests)
    .get('/requests/user/:userId', requests.getUserRequests)

    .post('/requests', requests.addUserRequests)
    // ------------------------------------------------

    // COMPANIES
    .get('/companies/list', companies.getList)
    .get('/companies/:companyId/referer', companies.getCompanyReferer)

    .post('/companies/subscribe', companies.subscribe)
    .post('/companies/unsubscribe', companies.unsubscribe)
    .post('/companies/invite', companies.sendInvite)
    // ------------------------------------------------

    // PROMOS
    .get('/promo/list', promos.getPromoList)
    .get('/promo/user/list/:userId', promos.getUserPromoList)
    .get('/promo/show/:promoId', promos.showPromo)
    .get('/promo/list/:siteId', promos.getSitePromoList)
    .get('/promo/open/:promoId', pages.openPromo)

    .post('/promo', promos.addPromo)
    .post('/promo/:promoId/attach', promos.attachPhoto)

    .put('/promo', promos.updatePromo)

    .delete('/promo/:promoId', promos.deletePromo)
    // ------------------------------------------------

    // PROMOS
    .post('/share', promos.sharePromo)
    // ------------------------------------------------

    // BILLS
    .post('/bill', bills.newBill)
    // ------------------------------------------------

    // QUESTION
    .post('/question', notify.newQuestion)
    // ------------------------------------------------

    // EXTERNAL SHARE
    .post('/share/external/login', externalShare.login)
    .post('/share/external/checklogin', externalShare.checkLogin)
    .post('/share/external/page', externalShare.sharePage)
    // ------------------------------------------------
    ;

export default router;
