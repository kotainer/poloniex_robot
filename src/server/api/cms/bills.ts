import { Crud } from '../crud-service';
import * as User from '../../models/user';
import * as Site from '../../models/site';
import * as Bill from '../../models/bill';

import * as validate from '../../services/validateToken';

export class Bills extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    async pay (ctx, next) {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const bill = await Bill.findById(ctx.params.billId);
            const user = await User.findById(bill.sender);
            const site = await Site.findById(user.siteId);

            user.balance = bill.summ;

            if (user.balance > 0) {
                user.isActiveBuisness = true;
                site.isActiveBuisness = true;
            }

            await user.save();
            await site.save();

            bill.isPaymed = true;
            ctx.body = await bill.save();
        } else {
            ctx.status = 401;
        }

        await next();
    };

}
