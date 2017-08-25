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
const tickerAPIURL = 'https://poloniex.com/public?command=returnTicker';

export class PoloniexAPI {
    wsuri = 'wss://api.poloniex.com';
    connection;
    lastLoans = [];
    myOpenLoansCount = 0;
    btcBalance = 0;
    coins = [];
    averageCurrentDay = 0;
    constructor() {
        // this.connection = new autobahn.Connection({
        //     url: this.wsuri,
        //     realm: 'realm1'
        // });

        // this.connection.onopen = (session) => {
        //     function marketEvent (args, kwargs) {
        //             console.log(args);
        //     }
        //     session.subscribe('ticker', marketEvent);
        // };

        // this.connection.onclose = () => {
        //     console.log('Websocket connection closed');
        // };

        // this.connection.open();

        setInterval(() => {
            this.getLoanBTC();
        }, 4000);

        setInterval(() => {
            this.returnAvailableAccountBalances();
            this.getMyBalances();
            this.returnActiveLoans();
            this.returnOpenLoanOffers();
            this.returnTicker();
        }, 40000);

        setInterval(() => {
            this.saveLoanBTC();
            this.averageDayRate();
        }, 100000);

        this.returnAvailableAccountBalances();
        this.getMyBalances();
        this.returnActiveLoans();
        this.returnOpenLoanOffers();
        this.returnTicker();
        this.averageDayRate();
        // this.createLoanOffer({rate: '0.0021', count: '0.011', range: '2'});
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

    getCoinsPrice() {
        return this.coins;
    }

    async returnTicker() {
        const coins: any = await new Promise(resolve => {
            this.coins = [];
            rp(tickerAPIURL)
            .then(coinsHTML => {
                this.coins = JSON.parse(coinsHTML);
                resolve();
            })
            .catch((err) => {
                // console.log(err);
                console.log('error network: returnTicker');
                resolve([]);
            });
        });
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
        await this.checkRate(loans);
    }

    async saveLoanBTC() {
        const loans: any = await new Promise(resolve => {
            this.lastLoans = [];
            rp(loanAPIURL)
            .then(ratingsHTML => {
                const ratings = JSON.parse(ratingsHTML);
                this.lastLoans = ratings.offers;
                resolve(ratings.offers);
            })
            .catch((err) => {
                console.log('error network: saveLoanBTC');
                resolve([]);
            });
        });

        for (const _loan of loans) {
            _loan.coin = 'BTC';
            const rate = parseFloat(_loan.rate);
            _loan.rate = rate.toFixed(5);
            const loan = new Loan(_loan);
            loan.createdDate = new Date();
            await loan.save();
        }
    }

    async getAverageRate() {
        const average = (await Loan.aggregate([{$group: {_id: 1, average: {$avg: '$rate'}}}]))[0];
        // console.log(average);
        return average;
    }

    async checkRate(loans) {
        if (this.btcBalance < 0.01) {
            return 0;
        }
        console.log('balance', this.btcBalance);
        const settings: any = await Settings.findOne({tag: 'main'});
        const minRate = loans[0];
        console.log('minRate', minRate.rate);
        if (minRate) {
            const rate = parseFloat(minRate.rate);
            const count = this.btcBalance > settings.maxCount ? settings.maxCount : this.btcBalance;
            console.log('rate', rate);
            console.log('count', count);
            if (rate > settings.minRate / 100) {
                this.createLoanOffer({rate: settings.minRate / 100, count, range: '2'});
            } else {
                if (this.averageCurrentDay === 0) {
                    return 0;
                }
                this.createLoanOffer({rate: this.averageCurrentDay + settings.averagePlus / 100, count, range: '2'});
            }
            this.btcBalance -= count;
        }
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
                const b = JSON.parse(r.body);
                if (b.lending && b.lending.BTC) {
                    this.btcBalance = b.lending.BTC;
                }

                return resolve(b);
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
                  const myLoans = JSON.parse(r.body);
                  if (Array.isArray(myLoans)) {
                    this.myOpenLoansCount = myLoans.length;
                  }

                  return resolve(myLoans);
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

    async averageDayRate() {
        const days: any = await Loan.aggregate([
        {
            $group: {
                '_id': {
                    'day': { '$dayOfMonth': '$createdDate' },
                    'month': { '$month': '$createdDate' },
                    'year': { '$year': '$createdDate' },
                },
                average: { $avg: '$rate' }
            }
        }]);
        for (const day of days) {
            day.day = day._id.day;
            day.month = day._id.month;
            day.year = day._id.year;
            delete day._id;
        }
        const last: any = _.last(_.sortBy(days, ['year', 'month', 'day']));
        this.averageCurrentDay = last.average;
    }

}
