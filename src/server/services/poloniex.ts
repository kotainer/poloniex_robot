import * as Loan from '../models/loan';
import * as MyLoan from '../models/myLoan';
import * as Settings from '../models/settings';
import * as Nonce from '../models/nonce';
import * as rp from 'request-promise';
import * as crypto from 'crypto';
import * as autobahn from 'autobahn';
import * as request from 'request';
import * as _ from 'lodash';

const ApiHelper = require('./apiHelper');

const privateKey = 'f4663943cdbe1f39e20213ff2fc0f3c98e8e1d50e1d50f52e23b9a2636d4470a0428844ff969ff1bc1d8e70a703c6863b9b3d9527d6d7e1b21867537a5893ca3';
const publicKey = 'MH2DCW1X-CE4IGD31-ETWIPOSC-XX3Z6RYJ';

const loanAPIURL = 'https://poloniex.com/public?command=returnLoanOrders&currency=BTC';

export class PoloniexAPI {
    wsuri = 'wss://api.poloniex.com';
    connection;
    lastLoans = [];
    constructor() {
        this.connection = new autobahn.Connection({
            url: this.wsuri,
            realm: 'realm1'
        });

        this.connection.onopen = (session) => {
            function marketEvent (args, kwargs) {
                    console.log(args);
            }
            session.subscribe('USDT_BTC', marketEvent);
        };

        this.connection.onclose = () => {
            console.log('Websocket connection closed');
        };

        // this.connection.open();

        setInterval(() => {
            // this.getMyBalances();
            this.getLoanBTC();
            // this.returnCompleteBalances();
            // this.returnOpenLoanOffers();
        }, 4000);
        // this.returnAvailableAccountBalances();
        // this.getMyBalances();
        // this.returnActiveLoans();
        // this.returnOpenLoanOffers();
        // this.createLoanOffer({rate: '0.0096', count: '0.0123456', range: '2'});
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

    getLastLoans() {
        return _.take(_.sortBy(this.lastLoans, [(el) => { return el.rate; }]), 10);
    }

    async getLoanBTC() {
        const loans: any = await new Promise(resolve => {
            this.lastLoans = [];
            rp(loanAPIURL)
            .then(ratingsHTML => {
                const ratings = JSON.parse(ratingsHTML);
                this.lastLoans = ratings.offers;
                resolve(ratings.offers);
            })
            .catch((err) => {
                // console.log(err);
                console.log('error network: getLoanBTC');
                resolve([]);
            });
        });

        for (const _loan of loans) {
            const existLoan = await Loan.findOne(_loan);
            if (!existLoan) {
                _loan.coin = 'BTC';
                const rate = parseFloat(_loan.rate);
                _loan.rate = rate.toFixed(5);
                const loan = new Loan(_loan);
                await loan.save();
                await this.checkRate(loan);
            }
        }
    }

    async getAverageRate() {
        const average = (await Loan.aggregate([{$group: {_id: 1, average: {$avg: '$rate'}}}]))[0];
        // console.log(average);
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

        return positiveBalances;
    }

    async returnCompleteBalances() {
        const balances: any = await new Promise(resolve => {
            this.makeRequest('returnCompleteBalances', {})
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
            if (balances[key].available > 0 || balances[key].onOrders > 0) {
                positiveBalances.push({
                    coin: key,
                    balance: balances[key],
                });
            }
        });
        return positiveBalances;
    }

    async returnAvailableAccountBalances() {
        const balances: any = await new Promise(resolve => {
            this.makeRequest('returnAvailableAccountBalances', {})
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

        const positiveBalances = {
            lending: []
        };
        if (balances.lending) {
            Object.keys(balances.lending).forEach(key => {
                if (balances.lending[key] > 0 ) {
                    positiveBalances.lending.push({
                        coin: key,
                        balance: balances.lending[key],
                    });
                }
            });
        }

        return positiveBalances;
    }

    async createLoanOffer({rate, count, range}) {
        const loan: any = await new Promise(resolve => {
            this.makeRequest('createLoanOffer', {
                currency: 'BTC',
                amount: count,
                duration: range,
                autoRenew: 0,
                lendingRate: rate,
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

        return loans;
    }

    async cancelLoanOffer(orderNumber: Number) {
        const result: any = await new Promise(resolve => {
            this.makeRequest('cancelLoanOffer', {orderNumber})
            .then((r: any) => {
              resolve({result: true});
            }).catch(err => {
                resolve(err);
            });
        });

        return result;
    }

}
