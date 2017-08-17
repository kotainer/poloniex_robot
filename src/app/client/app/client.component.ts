import { Component } from '@angular/core';
import { ApiService } from '../app/services/api.service';
import { SocketService } from '../app/services/socket.service';
import { Subject } from 'rxjs/Subject';
import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';
import TranslateLiterals from './strings/translate';

@Component({
  selector: 'app-root',
  templateUrl: './client.component.html'
})

export class ClientComponent {
  public user = null;
  public jwtToken = null;
  public isAuth = false;
  public translateLiterals = TranslateLiterals;
  private info;

  public options = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: 'visible',
    rtl: false,
    animate: 'scale',
    position: ['right', 'top']
  };

  private userAuthSource = new Subject();
  public userAuth$ = this.userAuthSource.asObservable();

  constructor(
    public _notificationsService: NotificationsService,
    public _socketService: SocketService,
    public _apiService: ApiService
  ) {
    if (!this.isAuth) {
      this.auth();
    }
    this.subscribeNotification();
  }

  public auth() {
      this.jwtToken = localStorage.getItem('sarafanToken') || 'null';
      this.authJWT();
  }

  private subscribeNotification() {
    this._socketService.getNotification().subscribe(
      data => {
        this.info = data;
        if (this.info.type === 'notification') {
          this._notificationsService.info(this.info.message.title, this.info.message.body);
        }
      }
    );
  }

  private authJWT() {
    this._apiService.authJWT(this.jwtToken).subscribe(
      data => {
        if (data.status === 'OK') {
          this.isAuth = true;
          this.user = data.user;

          this._socketService.initMessage({ id: this.user._id, token: this.jwtToken });

          this.userAuthSource.next(data.user);
        } else {
          this.userAuthSource.next(null);
          localStorage.clear();
        }
      },
      err => console.error(err)
    );
  }

  public setUserNotifyViewed(tag: string) {
    this._apiService.setNotifyViewed(this.jwtToken, this.user._id, tag).subscribe(
      data => {},
      err => console.error(err)
    );
  }

}
