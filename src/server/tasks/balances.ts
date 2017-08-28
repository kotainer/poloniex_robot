import * as Balance from '../models/balance';
import appServer from '../server';

import { SarafanMailer } from '../services/mailer';
const mailer = new SarafanMailer();

export class LogBalances {
    tick = async () => {
        const balances = await appServer.poloniex.getBalances();
        console.log('log balance', balances);
        if (Array.isArray(balances) && balances.length > 0) {
            for (const balance of balances) {
                const logBalance = new Balance(balance);
                await logBalance.save();
            }
        }
    }
}
