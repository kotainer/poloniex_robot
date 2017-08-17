import * as User from '../models/user';
import * as Site from '../models/site';
import * as Log from '../models/log';

export class Subscription {
    tick = async () => {
        const companies = await User.find({
            isBuisnessOwner: true,
            balance: {$gt: 0}
        });

        companies.forEach( async (company) => {
            if (company.tariff && company.tariff.price) {
                company.balance -= company.tariff.priceDay;
                const companySite = await Site.findById(company.siteId);

                if (company.balance > 0) {
                    company.isActiveBuisness = true;
                    companySite.isActiveBuisness = true;
                } else {
                    company.isActiveBuisness = false;
                    companySite.isActiveBuisness = false;
                }

                Log.create({
                    tag: 'subscription_task',
                    action: 'Списание средств',
                    sender: company._id,
                    more: `Имя - ${company.name} | логин - ${company.login} - 
                        списание ${company.tariff.priceDay} | ${company.tariff.name}`,
                }, () => { });

                await company.save();
                await companySite.save();
            }
        });
    }
}
