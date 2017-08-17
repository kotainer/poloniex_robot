import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as socketIo from 'socket.io-client';

// const SERVER_URL = '127.0.0.1:3012';
const SERVER_URL = 'sarafan.online';

@Injectable()
export class SocketService {
    private socket;
    private initSocketMessage;

    constructor() {
        this.initSocket();
        this.initSocketMessage = null;
    }

    private initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public send(message: any): void {
        this.socket.emit('message', message);
    }

    public initMessage(message: any): void {
        this.socket.emit('init', message);
        this.initSocketMessage = message;
    }

    public getNotification() {
        const observable = new Observable(observer => {
            this.socket.on('connect', (data) => {
                if (this.initSocketMessage) {
                    this.initMessage(this.initSocketMessage);
                }
            });

            this.socket.on('notification', (data) => {
                observer.next({type: 'notification', message: data});
            });

            this.socket.on('updateNotifyStatus', (data) => {
                observer.next({type: 'updateNotifyStatus', message: data});
            });

            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
};
