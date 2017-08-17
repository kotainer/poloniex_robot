import { Crud } from '../crud-service';
import * as settingsModel from '../../models/settings';
import * as validate from '../../services/validateToken';

export class Settings extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

    async getSettingsByTag (ctx, next) {
        if (await validate.validateToken(ctx.headers.authorization)) {
            ctx.body = await settingsModel.findOne({tag: ctx.params.tag});
        } else {
            ctx.status = 401;
        }

        await next();
    };

}
