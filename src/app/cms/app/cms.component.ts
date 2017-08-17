
import { Component } from '@angular/core';
import { ApiService } from '../app/services/api.service';
import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

@Component({
  selector: 'cms-root',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CMSComponent {
  public user = null;
  public jwtToken = null;
  public isAuth = false;
  private info;
  public busy;

  private userAuthSource = new Subject();
  public userAuth$ = this.userAuthSource.asObservable();

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

  constructor(
    private router: Router,
    public _notificationsService: NotificationsService,
    public _apiService: ApiService
  ) {
    if (!this.isAuth) {
      this.jwtToken = localStorage.getItem('vitalCMSToken');

      if (this.jwtToken) {
        this.authJWT();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  private authJWT() {
    this._apiService.authJWT(this.jwtToken).subscribe(
      data => {
        if (data.status === 'OK') {
          this.user = data.user;
          this.isAuth = true;

          this.userAuthSource.next(data.user);
        } else {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      },
      err => console.error(err)
    );
  }
}
