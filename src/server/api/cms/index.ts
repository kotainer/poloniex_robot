import { AdminAuth } from './auth';
import { Admin } from './admins';
import { Users } from './users';
import { Settings } from './settings';
import { Statistics } from './stats';
import { Tariff } from './tariffs';
import { Accruals } from './accruals';
import { Orders } from './orders';
import { Bills } from './bills';
import { Balances } from './balances';
import { Loans } from './loans';

import * as AdminModel from '../../models/admin';
import * as UserModel from '../../models/user';
import * as SettingsModel from '../../models/settings';
import * as TariffModel from '../../models/tariff';
import * as AccrualsModel from '../../models/accrual';
import * as OrderModel from '../../models/order';
import * as BillModel from '../../models/bill';

const convert = require('koa-convert');

const Router = require('koa-router');
const router = new Router({ prefix: '/api/cms' });

const admin = new Admin(AdminModel, 'admin');
const users = new Users(UserModel, 'user');
const settings = new Settings(SettingsModel, 'settings');
const tariffs = new Tariff(TariffModel, 'tariffs');
const stats = new Statistics();
const accruals = new Accruals(AccrualsModel, 'accruals');
const orders = new Orders(OrderModel, 'accruals');
const bills = new Bills(BillModel, 'bills');
const balances = new Balances();
const loans = new Loans();

const adminAuth = new AdminAuth();

router
    // AUTH
    .get('/auth/validate', adminAuth.validate)

    .post('/auth/login', adminAuth.login)
    // ------------------------------------------------

    // MANAGE ADMIN
    .post('/admin/new', admin.create)
    // ------------------------------------------------


    // MANAGE USERS
    .get('/users', users.list)
    .get('/users/:id', users.show)

    .post('/users/:id', users.update)

    .post('/users/:id/banned', users.updateUserBanStatus)

    .delete('/users/:id', users.removeUser)
    // ------------------------------------------------

    // CMS SETTINGS
    .get('/settings/:tag', settings.getSettingsByTag)

    .post('/settings', settings.create)

    .put('/settings/:id', settings.update)

    .delete('/settings/:id', settings.delete)
    // ------------------------------------------------

    // TARIFFS
    .get('/tariffs', tariffs.list)
    .get('/tariff/:id', tariffs.show)

    .post('/tariff', tariffs.create)

    .put('/tariff/:id', tariffs.update)

    .delete('/tariff/:id', tariffs.delete)
    // ------------------------------------------------

    // STATISTICS
    .get('/statistics/lastusers', stats.lastUsers)
    .get('/statistics/users', stats.userStats)
    .get('/statistics/convers', stats.conversByMonth)
    .get('/statistics/share', stats.share)

    // ------------------------------------------------

    // ACCRUALS
    .get('/accruals', accruals.list)

    // ------------------------------------------------

    // ORDERS
    .get('/orders/last', orders.last)

    // ------------------------------------------------

    // BILLS
    .get('/bills', bills.list)

    .post('/bill/:billId', bills.pay)

    // ------------------------------------------------



    // BALANCES
    .get('/balances/complete', balances.complete)
    .get('/balances/available', balances.available)
    .get('/balances/price', balances.coinsPrice)
    .get('/balances/coins', balances.coinsBalances)

    // ------------------------------------------------

    // LOANS
    .get('/loans/open', loans.openLoanOffers)
    .get('/loans/active', loans.activeLoans)
    .get('/loans/average', loans.averageRate)
    .get('/loans/average/days', loans.averageDayRate)
    .get('/loans/last', loans.last)

    .post('/loans/:id/cancel', loans.cancelLoan)
    // ------------------------------------------------
    ;

export default router;
