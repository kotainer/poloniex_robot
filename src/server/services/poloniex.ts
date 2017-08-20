import * as Loan from '../models/loan';
import * as MyLoan from '../models/myLoan';
import * as Settings from '../models/settings';
import * as Nonce from '../models/nonce';
import * as rp from 'request-promise';
import * as crypto from 'crypto';

const request = require('request');
const ApiHelper = require('./apiHelper');

const privateKey = 'f4663943cdbe1f39e20213ff2fc0f3c98e8e1d50e1d50f52e23b9a2636d4470a0428844ff969ff1bc1d8e70a703c6863b9b3d9527d6d7e1b21867537a5893ca3';
const publicKey = 'MH2DCW1X-CE4IGD31-ETWIPOSC-XX3Z6RYJ';

const loanAPIURL = 'https://poloniex.com/public?command=returnLoanOrders&currency=BTC';

export class PoloniexAPI {
    connection: any;

    constructor() {
        // setInterval(() => {
        //     this.getMyBalances();
        //     this.getLoanBTC();
            
        // }, 8000);
        this.getMyBalances();
        this.returnActiveLoans();
        this.returnOpenLoanOffers();
        // this.createLoanOffer({rate: '0.00009681', count: '0.01', range: '2'});
    }

    makeRequest(command, opts) {
        const PRIVATE_API_URL = 'https://poloniex.com/tradingApi';
        const apiHelper = ApiHelper.create(publicKey, privateKey, false);

        const promise = new Promise((resolve, reject) => {
            request.post(apiHelper.createOptions({
            url: PRIVATE_API_URL,
            queryString: apiHelper.createQueryString(command, opts),
            method: opts.method || 'post' }), (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
            });
        });
        return promise;
    }

    async getLoanBTC() {
        const loans: any = await new Promise(resolve => {
            rp(loanAPIURL)
            .then(ratingsHTML => {
                const ratings = JSON.parse(ratingsHTML);
                resolve(ratings.offers);
            })
            .catch((err) => {
                // console.log(err);
                console.log('error network');
                resolve([]);
            });
        });

        for (const _loan of loans) {
            const existLoan = await Loan.findOne(_loan);
            if (!existLoan) {
                _loan.coin = 'BTC';
                const loan = new Loan(_loan);
                await loan.save();
                await this.checkRate(loan);
            }
        }
    }

    async getAverageRate() {
        const average = (await Loan.aggregate([{$group: {_id: 1, average: {$avg: '$rate'}}}]))[0];
        console.log(average);
        return average;
    }

    async checkRate(loan) {
        const main = await Settings.findOne({tag: 'main'});
        const myCount = await MyLoan.find().count();
        // console.log(myCount);
        if (!main) {
            console.log('settings not found');
            return;
        }

        if (myCount >= main.settings.limitLoans) {
            console.log('limit count exeed');
            return;
        }

        if (loan.rate >= main.settings.autoLoan) {
            // Даем займ
            console.log('Делаем предложение', loan);
            return;
        }
        const average: any = await this.getAverageRate();
        if (loan.rate >= average.average + main.settings.averagePlus) {
            // Даем займ
            console.log('Делаем предложение', loan);
            return;
        }

        // console.log('НЕ делаем предложение');
    }

    async getNonce() {
        const nonce = await Nonce.findById('nonce');
        if (!nonce) {
            const newNonce = new Nonce();
            await newNonce.save();
            return newNonce.count;
        }
        nonce.count ++;
        await nonce.save();
        return nonce.count;
    }

    async getMyBalances() {
        const balances: any = await new Promise(resolve => {
            this.makeRequest('returnBalances', {})
            .then((r: any) => {
              if (r.body) {
                  return resolve(JSON.parse(r.body));
              }
              resolve([]);
            }).catch(err => {
                console.log(err);
                resolve([]);
            });
        });

        const positiveBalances = [];

        Object.keys(balances).forEach(key => {
            if (balances[key] > 0) {
                positiveBalances.push({
                    coin: key,
                    balance: balances[key],
                });
            }
        });
        console.log('balances', positiveBalances);
        return positiveBalances;
    }

    async createLoanOffer({rate, count, range}) {
        const loan: any = await new Promise(resolve => {
            this.makeRequest('createLoanOffer', {
                currency: 'BTC',
                amount: 0.01,
                duration: 2,
                autoRenew: 0,
                lendingRate: '0.00009643141183723798'
            })
            .then((r: any) => {
              if (r.body) {
                  return resolve(JSON.parse(r.body));
              }
              resolve([]);
            }).catch(err => {
                console.log(err);
                resolve([]);
            });
        });
        console.log('loan', loan);
        return loan;
    }

    async returnOpenLoanOffers() {
        const loans: any = await new Promise(resolve => {
            this.makeRequest('returnOpenLoanOffers', {})
            .then((r: any) => {
              if (r.body) {
                  return resolve(JSON.parse(r.body));
              }
              resolve([]);
            }).catch(err => {
                console.log(err);
                resolve([]);
            });
        });
        console.log('my open loans', loans);
        return loans; 
    }

    async returnActiveLoans() {
        const loans: any = await new Promise(resolve => {
            this.makeRequest('returnActiveLoans', {})
            .then((r: any) => {
              if (r.body) {
                  return resolve(JSON.parse(r.body));
              }
              resolve([]);
            }).catch(err => {
                console.log(err);
                resolve([]);
            });
        });
        console.log('my active loans', loans);
        return loans; 
    }

}
