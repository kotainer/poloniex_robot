import * as User from '../../models/admin';
import * as Log from '../../models/log';

import passport from '../../middleware/userAuthStategy';
const jwtsecret = 'sarafanprettygoodsecurekey'; // ключ для подписи JWT
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp

export class AdminAuth {

    async login (ctx, next) {
        await passport.authenticate('local', function (err, user) {
            if (user === false) {
                ctx.status = 401;
                Log.create({
                    tag: 'authFailureAdmin',
                    action: 'Неудачная попытка авторизации',
                    more: JSON.stringify(ctx.request.body)
                }, () => {
                    ctx.body = { error: 'Неверный логин пользователь или пароль', status: '401' };
                });

            } else {
                Log.create({
                    tag: 'authSuccesAdmin',
                    action: 'Успешная авторизация администратора',
                    sender: user._id,
                    more: JSON.stringify(ctx.request.body)
                }, () => { });

                // --payload - информация которую мы храним в токене и можем из него получать
                const payload = {
                    id: user._id,
                    login: user.login,
                    email: user.email,
                    isAdmin: true,
                };
                const token = jwt.sign(payload, jwtsecret); // здесь создается JWT

                ctx.body = { status: 'OK', isBuisnessOwner: user.isBuisnessOwner, token: 'JWT ' + token };
            }

        })(ctx, next);

    };

    async register (ctx, next) {
        try {
            ctx.body = await User.create(ctx.request.body);

            Log.create({
                tag: 'registerAdmin',
                action: 'Регистрация нового администратора',
                sender: ctx.body._id,
                more: JSON.stringify(ctx.request.body)
            }, () => { });

        } catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }

        await next();
    };

    // валидация jwt токена
    async validate (ctx, next) {
        await passport.authenticate('jwt', function (err, user) {
            if (user) {
                ctx.body = { status: 'OK', user: user };
            } else {
                ctx.body = { status: 'error', user: null };

                Log.create({
                    tag: 'authFailureAdminJWT',
                    action: 'Неудачная авторизация по токену администратора',
                    more: JSON.stringify(ctx.request.header)
                }, () => { });
            }
        })(ctx, next);
    };

};
