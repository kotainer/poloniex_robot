import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as chalk from 'chalk';

import * as serve from 'koa-static';
import * as logger from 'koa-logger';
import * as compress from 'koa-compress';
import * as conditional from 'koa-conditional-get';
import * as etag from 'koa-etag';

import { SocketServer } from './services/sockets';
import { Tasks } from './tasks';

const tasks = new Tasks().runTasks();

import routes from './api';

import passport from './middleware/userAuthStategy';
import err from './middleware/error';

const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3012;

const app = new Koa();

const appRootDir = require('app-root-dir').get();
const config = require('config');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true); // вываливаем все запросы в консоль

mongoose.connect(config.get('db'));


// app.use(conditional());
app.use(etag());
app.use(compress());
app.use(bodyParser({
    formLimit: '7mb'
}));
app.use(serve(appRootDir + '/public'));

app.use(err);

if (env === 'development') {
    app.use(logger());
}

app.use(passport.initialize());

app.use(routes);

const server = app.listen(port, () => {
    if (env === 'dev') {
        console.log(chalk.black.bgGreen.bold(`Listening on port ${port} db: ${config.get('db')}`));
        console.log(chalk.red.bold('А ты помнишь про TDD? Написал(а) тесты?'));
    };
});

const socketServer: SocketServer = new SocketServer();

const appServer = {
    server: server,
    socketServer
};

export default appServer;


socketServer.initScokets();
