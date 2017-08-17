const nodemailer = require('nodemailer');
const pug = require('pug');
const appRootDir = require('app-root-dir').get();
const config = require('config');

export class SarafanMailer {
    transporterInfo = nodemailer.createTransport({
        host: 'mail.nic.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'info@sarafan.online',
            pass: '8RNEGGfsNbfXY',
        },
        dkim: {
            domainName: 'sarafan.online',
            keySelector: 'sarafan',
            privateKey: config.get('dkim_private'),
        },
    });

    transporterSupport = nodemailer.createTransport({
        host: 'mail.nic.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'support@sarafan.online',
            pass: 'EXDCemCHBCb8M',
        },
        dkim: {
            domainName: 'sarafan.online',
            keySelector: 'sarafan',
            privateKey: config.get('dkim_private'),
        },
    });

    transporterNoReply = nodemailer.createTransport({
        host: 'mail.nic.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'no-reply@sarafan.online',
            pass: '6kjJ3CbgECj76',
        },
        dkim: {
            domainName: 'sarafan.online',
            keySelector: 'sarafan',
            privateKey: config.get('dkim_private'),
        },
    });

    /**
     * Отправка письмо о регистрации
     * @param {User} receiver пользователь, который зарегался
     */
    async sendRegisterMail(receiver: any) {
        let html;
        if (receiver.isBuisnessOwner) {
          html = await pug.renderFile(appRootDir + '/views/mails/register-business.pug', {receiver});
        } else {
          html = await pug.renderFile(appRootDir + '/views/mails/register.pug', {receiver});
        }
        const mailOptions = {
            from: '"Sarafan.online" <no-reply@sarafan.online>',
            to: receiver.email,
            subject: 'Добро Пожаловать в Сарафан!',
            html: html,
        };

        return this.transporterNoReply.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    /**
     * Отправка письма с востановленным паролем
     * @param {User} receiver пользователь
     * @param {String} newPass сгенерированный пароль
     */
    async sendRestorePassMail(receiver: any, newPass: string) {
        const html = await pug.renderFile(appRootDir + '/views/mails/restore.pug', {receiver, newPass});
        const mailOptions = {
            from: '"Sarafan.online" <no-reply@sarafan.online>',
            to: receiver.email,
            subject: 'Восстановление пароля на Сарафане',
            html: html,
        };

        return this.transporterNoReply.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    /**
     * Отправка письма с приглашением на сервис
     * @param {String} email почта компании
     */
    async sendInviteCompanyMail(email: string) {
        const html = await pug.renderFile(appRootDir + '/views/mails/invite.pug');
        const mailOptions = {
            from: '"Sarafan.online" <no-reply@sarafan.online>',
            to: email,
            subject: 'Приглашение на сайт Sarafan.online',
            html: html,
        };

        return this.transporterNoReply.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    /**
     * Отправка на office@creograf.ru пожелания на новый счёт
     * @param {User} receiver пользователь
     * @param {Bill} bill информация о счёте
     */
    async sendNewBillMail(receiver: any, bill: any) {
        const html = await pug.renderFile(appRootDir + '/views/mails/newBill.pug', {receiver, bill});
        const mailOptions = {
            from: '"Sarafan.online" <no-reply@sarafan.online>',
            to: 'office@creograf.ru',
            subject: 'Новый счёт на сайте Sarafan.online',
            html: html,
        };

        return this.transporterNoReply.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    /**
     * Отправка письма с последними акциями
     * @param {User} receiver пользователь
     * @param {Array} promos акции
     */
    async sendPromosListMail(receiver: any, promos: any) {
        const html = await pug.renderFile(appRootDir + '/views/mails/promos.pug', {receiver, promos});
        const mailOptions = {
            from: '"Sarafan.online" <no-reply@sarafan.online>',
            to: receiver.email,
            subject: 'Новые акции на Сарафане',
            html: html,
        };

        return this.transporterNoReply.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }

    /**
     * Отправка письма с вопросом к менеджеру
     * @param {Object} params пользователь
     */
    async sendQuestionMail(params: any) {
        const html = await pug.renderFile(appRootDir + '/views/mails/question.pug', {params});
        const theme = params.message ? 'Новый вопрос на Сарафане' : 'Новая заявка на консультацию на Сарафане';
        const mailOptions = {
            from: '"Sarafan.online" <info@sarafan.online>',
            to: 'office@creograf.ru',
            subject: theme,
            html: html,
        };

        return this.transporterInfo.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
    }
};
