const cron = require('node-cron');
const chalk = require('chalk');

import { Subscription } from './subscription';
import { NewPromos } from './new_promos';

export class Tasks {
    runTasks = () => {
        this.subscriptionPayment();
        this.newPromoMailNotify();
    }

    subscriptionPayment = () => {
        cron.schedule('1 1 1 * * *', () => {
            new Subscription().tick();
        });

        if (process.env.NODE_ENV === 'dev') {
            console.log(chalk.white.bgBlue.bold('[tasks] Задача пересчета балансов запущена'));
        }
    }

    newPromoMailNotify = () => {
        cron.schedule('1 1 9 * * *', () => {
            new NewPromos().tick();
        });

        if (process.env.NODE_ENV === 'dev') {
            console.log(chalk.white.bgBlue.bold('[tasks] Задача уведомления о новых акциях запущена'));
        }
    }
};
