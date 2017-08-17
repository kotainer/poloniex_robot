import * as validate from '../../services/validateToken';
import * as Log from '../../models/log';
import * as User from '../../models/user';
import * as Order from '../../models/order';
import * as _ from 'lodash';
import * as moment from 'moment';

export class Statistics {

    /**
     * Список последних пользователей
     */
    lastUsers = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const loginTag = ['authSucces', 'authSuccesJWT'];
            const ids: any = await Log.find({tag: {$in: loginTag}}).lean()
            .select('sender date')
            .limit(200)
            .sort('-date')
            .populate('sender');

            const lastUsers = [];
            ids.forEach(user => {
                if (lastUsers.length >= 5) {
                    return;
                }

                const newItem = {
                    _id: user.sender._id,
                    login: user.sender.login,
                    photo: user.sender.photo.small.url || '',
                    email: user.sender.email,
                    phone: user.sender.phone,
                    date: user.date,
                };

                const finded = _.find(lastUsers, elem => {
                    return newItem._id === elem._id;
                });

                if (! finded) {
                    lastUsers.push(newItem);
                }

            });

            ctx.body = lastUsers;
        } else {
            ctx.status = 401;
        }

        await next();
    }

    /**
     * Статистика по пользователям
     */
    userStats = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const result = {
                all: 0,
                today: 0,
                yesterday: 0,
                currMonth: 0,
                prevMonth: 0,
                allTurn: 0,
                users: 5,
                shops: 2,
            };
            const loginTag = ['authSucces', 'authSuccesJWT'];

            const todayStart = moment().hour(0).minute(0);
            const todayEnd = moment().hour(23).minute(59);

            const yesterdayStart = moment().subtract(1, 'day').hour(0).minute(0);
            const yesterdayEnd = moment().subtract(1, 'day').hour(23).minute(59);

            const currMonthStart = moment().date(1).hour(0).minute(0);
            const currMonthEnd = moment().date(30).hour(23).minute(59);

            const prevMonthStart = moment().set('month', moment().month() - 1);
            prevMonthStart.date(1).hour(0).minute(0);
            const prevMonthEnd = moment().set('month', moment().month() - 1);
            prevMonthEnd.date(30).hour(23).minute(59);

            result.all = await User.find().count();
            result.users = await User.find({isBuisnessOwner: false}).count();
            result.shops = await User.find({isBuisnessOwner: true}).count();

            const today = await Log.find({
                'date': {
                    $gte: todayStart,
                    $lte: todayEnd,
                },
                'tag': {$in: loginTag},
            }).select('sender');
            result.today = _.uniqBy(today, 'sender').length;

            const yesterday = await Log.find({
                'date': {
                    $gte: yesterdayStart,
                    $lte: yesterdayEnd,
                },
                'tag': {$in: loginTag},
            }).select('sender');
            result.yesterday = _.uniqBy(yesterday, 'sender').length;

            const currMonth = await Log.find({
                'date': {
                    $gte: currMonthStart,
                    $lte: currMonthEnd,
                },
                'tag': {$in: loginTag},
            }).select('sender');
            result.currMonth = _.uniqBy(currMonth, 'sender').length;

            const prevMonth = await Log.find({
                'date': {
                    $gte: prevMonthStart,
                    $lte: prevMonthEnd,
                },
                'tag': {$in: loginTag},
            }).select('sender');
            result.prevMonth = _.uniqBy(prevMonth, 'sender').length;

            ctx.body = result;

        } else {
            ctx.status = 401;
        }

        await next();
    }

    /**
     * Конверсия по месяцам
     */
    conversByMonth = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const result = [
                {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
                {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
            ];

            const opens = await Log.find({tag: 'openSite'});
            opens.forEach((item) => {
                result[0].data[moment(item.date).month()] ++;
            });
            const orders = await Order.find();
            orders.forEach((item) => {
                result[1].data[moment(item.date).month()] ++;
            });
            ctx.body = result;

        } else {
            ctx.status = 401;
        }

        await next();
    }

    /**
     * Статистика нажатия кнопок поделиться в соц. сетях
     */
    share = async (ctx, next) => {
        if (await validate.validateToken(ctx.headers.authorization)) {
            const result = [0, 0, 0];

            const share = await Log.find({tag: 'sharePromo'});
            share.forEach((item) => {
                switch (item.action) {
                    case 'vk':
                        result[0] ++;
                        break;
                    case 'fb':
                        result[1] ++;
                        break;
                    case 'tw':
                        result[2] ++;
                        break;
                }
            });
            ctx.body = result;

        } else {
            ctx.status = 401;
        }

        await next();
    }

}
