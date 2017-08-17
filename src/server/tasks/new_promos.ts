import * as User from '../models/user';
import * as Promo from '../models/promo';
import * as Log from '../models/log';
import * as moment from 'moment';

import { SarafanMailer } from '../services/mailer';
const mailer = new SarafanMailer();

export class NewPromos {
    tick = async () => {
        const users = await User.find({
            isBuisnessOwner: false,
            isInvite: true,
        });

        users.forEach( async (user) => {
            const interval = moment().subtract('day', 1);
            interval.hour(0).minute(0);
            const query = {
                createdDate: {
                    $gte: new Date(interval.toISOString()),
                }
            };

            if (user.subscribeCompanies.length > 0) {
                query['siteId'] = { $in: user.subscribeCompanies };
            }

            const promos: any = await Promo.find(query)
            .populate('siteId')
            .sort('-createdDate')
            .lean();

            if ( promos.length > 0) {
                mailer.sendPromosListMail(user, promos);

                Log.create({
                    tag: 'new_promo_mail',
                    action: 'Письмо с новыми акциями',
                    sender: user._id,
                    more: `Имя - ${user.name} | логин - ${user.login}`,
                }, () => { });
            }
        });
    }
}
