const cron = require('node-cron');
const chalk = require('chalk');

import { LogBalances } from './balances';

export class Tasks {
    runTasks = () => {
        this.logBalances();
    }

    logBalances = () => {
        cron.schedule('1 0 0 * * *', () => {
            new LogBalances().tick();
        });

        if (process.env.NODE_ENV === 'dev') {
            console.log(chalk.white.bgBlue.bold('[tasks] Задача логирования баланса'));
        }
    }
};
