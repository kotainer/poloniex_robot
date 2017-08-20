import * as validate from '../../services/validateToken';
import * as _ from 'lodash';
import appServer from '../../server';

export class Loans {

    /**
     * Список октрытых предложений на займ
     */
    openLoanOffers = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const loans = await appServer.poloniex.returnOpenLoanOffers();
            const normalizeLoans = [];
            Object.keys(loans).forEach(key => {
                if (key === 'error') {
                    return ctx.status = 400;
                }
                for (const loan of loans[key]) {
                    normalizeLoans.push({
                        coin: key,
                        amount: loan.amount,
                        autoRenew: loan.autoRenew,
                        date: loan.date,
                        duration: loan.duration,
                        id: loan.id,
                        rate: loan.rate,
                    });
                }
            });
            ctx.body = normalizeLoans;
        } else {
            ctx.status = 401;
        }

        await next();
    }

    activeLoans = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await appServer.poloniex.returnActiveLoans();
        } else {
            ctx.status = 401;
        }

        await next();
    }

    averageRate = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await appServer.poloniex.getAverageRate();
        } else {
            ctx.status = 401;
        }

        await next();
    }

    cancelLoan = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await appServer.poloniex.cancelLoanOffer(ctx.params.id);
        } else {
            ctx.status = 401;
        }

        await next();
    }

    last = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = appServer.poloniex.getLastLoans();
        } else {
            ctx.status = 401;
        }

        await next();
    }

}