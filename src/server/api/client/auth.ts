import * as User from '../../models/user';
import * as Log from '../../models/log';

import { SarafanMailer } from '../../services/mailer';
const mailer = new SarafanMailer();

import passport from '../../middleware/userAuthStategy';
const jwtsecret = 'sarafanprettygoodsecurekey'; // ключ для подписи JWT
const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const appRootDir = require('app-root-dir').get();
import * as moment from 'moment';


const crud = {

    login: async (ctx, next) => {
        await passport.authenticate('local', function (err, user) {
            if (user === false) {
                Log.create({
                    tag: 'authFailure',
                    action: 'Неудачная попытка авторизации',
                    more: JSON.stringify(ctx.request.body)
                }, () => {
                    ctx.body = { error: 'Неверный логин пользователь или пароль', status: '401' };
                });

            } else {
                Log.create({
                    tag: 'authSucces',
                    action: 'Успешная авторизация',
                    sender: user._id,
                    more: JSON.stringify(ctx.request.body)
                }, () => { });

                // --payload - информация которую мы храним в токене и можем из него получать
                const payload = {
                    id: user._id,
                    login: user.login,
                    email: user.email,
                    isAdmin: false,
                    expireAt: moment().add(7, 'days'),
                };
                const token = jwt.sign(payload, jwtsecret); // здесь создается JWT

                ctx.body = { status: 'OK', isBuisnessOwner: user.isBuisnessOwner, token: 'JWT ' + token };
            }

        })(ctx, next);

    },

    register: async (ctx, next) => {
        try {
            if (ctx.request.body.referal) {
                const parent = await User.findOne({ login: ctx.request.body.referal });
                if (parent) {
                    ctx.request.body.parent = parent._id;
                    const user: any = await User.create(ctx.request.body);
                    // const createdUser = await User.findById(user._id);
                    // const attached = await new Promise(resolve => {
                    //     createdUser.attach('photo', {path: `${appRootDir}/public/images/default.png`}, function (res) {
                    //         resolve();
                    //     });
                    // });

                    mailer.sendRegisterMail(user);
                    return ctx.body = user;
                } else {
                    throw { message: 'Реферал с таким логином не найден', code: '404' };
                }

            } else {
                const user: any = await User.create(ctx.request.body);
                // const createdUser = await User.findById(user._id);
                // const attached = await new Promise(resolve => {
                //     createdUser.attach('photo', {path: `${appRootDir}/public/images/default.png`}, function (res) {
                //         resolve();
                //     });
                // });
                ctx.body = user;

                mailer.sendRegisterMail(user);

                Log.create({
                    tag: 'register',
                    action: 'Регистрация нового пользователя',
                    sender: ctx.body._id,
                    more: JSON.stringify(ctx.request.body)
                }, () => { });
            }

        } catch (err) {
            ctx.status = 400;
            ctx.body = err;
        }

        await next();
    },

    restorePass: async (ctx, next) => {
        if (ctx.request.body.email) {
            const user: any = await User.findOne({email: ctx.request.body.email});
            if (user) {
                const newPassword = generatePass();
                user.password = newPassword;
                mailer.sendRestorePassMail(user, newPassword);
                await user.save();
                ctx.status = 200;
                ctx.body = {status: 'ok', message: 'Письмо с инструкциями отправлено на Ваш адрес'};
            } else {
                ctx.status = 404;
                ctx.body = 'Пользователь с таким адресом не существует';
            }
        } else {
            ctx.status = 400;
        }

    },

    // валидация jwt токена
    validate: async (ctx, next) => {
        await passport.authenticate('jwt', function (err, user) {
            if (user) {
                ctx.body = { status: 'OK', user: user };

                Log.create({
                    tag: 'authSuccesJWT',
                    action: 'Успешная авторизация по токену',
                    sender: user._id,
                    more: JSON.stringify(ctx.request.header)
                }, () => { });

            } else {
                ctx.body = { status: 'error', user: null };

                Log.create({
                    tag: 'authFailureJWT',
                    action: 'Неудачная авторизация по токену',
                    more: JSON.stringify(ctx.request.header)
                }, () => { });
            }

        })(ctx, next);
    },

};

function generatePass() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export default crud;

// ---Socket Communication-----//
// let io = socketIO(server);

// io.on('connection', socketioJwt.authorize({
//   secret: jwtsecret,
//   timeout: 15000
// })).on('authenticated', function (socket) {

//   console.log('Это мое имя из токена: ' + socket.decoded_token.displayName);

//   socket.on('clientEvent', (data) => {
//     console.log(data);
//   })
// });
