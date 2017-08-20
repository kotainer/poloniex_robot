import * as validate from '../../services/validateToken';
import * as _ from 'lodash';
import appServer from '../../server';

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
            ctx.body = await appServer.poloniex.returnAvailableAccountBalances();
        } else {
            ctx.status = 401;
        }

        await next();
    }

}
