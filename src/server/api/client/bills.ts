import * as validate from '../../services/validateToken';
import * as Bill from '../../models/bill';
import * as User from '../../models/user';

import { SarafanMailer } from '../../services/mailer';
const mailer = new SarafanMailer();

const crud = {

    newBill: async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const billParams = JSON.parse(ctx.request.body.bill);
            const bill: any = new Bill(billParams);
            await bill.save();

            const user = await User.findById(bill.sender);
            user.tariff = bill.tariff;

            ctx.body = await user.save();

            mailer.sendNewBillMail(user, bill);
        } else {
            ctx.status = 401;
        }
        await next();

    },

};

export default crud;
