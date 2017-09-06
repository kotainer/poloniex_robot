import * as validate from '../../services/validateToken';
import * as _ from 'lodash';
import appServer from '../../server';
import * as BalancesModel from '../../models/balance';
import * as moment from 'moment';

export class Balances {

    /**
     * Список балансов
     */
    complete = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await appServer.poloniex.returnCompleteBalances();
        } else {
            ctx.status = 401;
        }

        await next();
    }

    available = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const balances = await appServer.poloniex.returnAvailableAccountBalances();
            const available = {};
            if (balances.lending) {
                for (const el of balances.lending) {
                    available[el.coin] = el.balance;
                }
            }
            ctx.body = available;
        } else {
            ctx.status = 401;
        }

        await next();
    }

    coinsPrice = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await appServer.poloniex.getCoinsPrice();
        } else {
            ctx.status = 401;
        }

        await next();
    }

    coinsBalances = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const result = {
                labels: [],
                coinsBalance: [],
                coinsName: [],
            };

            const balances = await BalancesModel.find().sort('createdDate');
            // Собираем название монет
            for (const balance of balances) {
                if (result.coinsName.indexOf(balance.coin) === -1) {
                    result.coinsName.push(balance.coin);
                }
            }

            // Выбираем все даты
            for (const balance of balances) {
                const dateString = '' + moment(balance.createdDate).date() +
                    '.' + (moment(balance.createdDate).month() + 1) +
                    '.' + moment(balance.createdDate).year();
                balance.dateString = dateString;
                if (result.labels.indexOf(dateString) === -1) {
                    result.labels.push(dateString);
                }
            }

            // Собираем всё в кучу
            for (const coin of result.coinsName) {
                const coinBalance = [];
                for (const dateString of result.labels) {
                    const dateBalance = _.find(balances, {coin, dateString});
                    if (!dateBalance) {
                        coinBalance.push(0);
                        continue;
                    }
                    coinBalance.push(dateBalance.balance);
                }
                result.coinsBalance.push(coinBalance);
            }

            ctx.body = result;
        } else {
            ctx.status = 401;
        }

        await next();
    }

}
