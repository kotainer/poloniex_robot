import { Crud } from '../crud-service';
import * as validate from '../../services/validateToken';
import * as Order from '../../models/order';

export class Orders extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    last = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await Order.find().populate('siteId userId').limit(5).sort('-date');
        } else {
            ctx.status = 401;
        }

        await next();
    }

}
