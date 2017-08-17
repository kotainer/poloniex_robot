import * as socketIo from 'socket.io';
import * as _ from 'lodash';
import appServer from '../server';

export class SocketServer {
    io: any;
    users: any;

    initScokets(): void {
        this.io = socketIo.listen(appServer.server);
        this.users = [];

        this.io.on('connect', (socket: any) => {
            socket.on('message', (m: any) => {
                // console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('init', (m: any) => {
                socket.userId = m.id;
                socket.jwt = m.token;

                if (!this.users[m.id]) {
                    this.users[m.id] = [socket.conn.id];
                } else if (_.indexOf(this.users[m.id], socket.conn.id) === -1) {
                    this.users[m.id].push(socket.conn.id);
                }

            });

            socket.on('disconnect', () => {
                this.users[socket.userId] = _.remove(this.users[socket.userId], function (n) {
                    return n === socket.conn.id;
                });
            });

        });
    }

    /**
     * Отправка уведомления пользователю
     * @param {String} userId идентификатор пользователя
     * @param {Object} data объект уведомления
     */
    notifyClient(userId: string, data: object): void {
        const socks = this.users[userId];
        if (socks) {
            socks.forEach(element => {
                this.io.to(element).emit('notification', data);
            });

        }
    };

    /**
     * Отправка пользователю команды для обновления счетчиков уведомлений
     * @param {String} userId идентификатор пользователя
     */
    updateNotifyStatus(userId: string) {
        const socks = this.users[userId];
        if (socks) {
            socks.forEach(element => {
                this.io.to(element).emit('updateNotifyStatus', userId);
            });

        }
    }

};
