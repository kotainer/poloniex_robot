import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientComponent } from '../app/client.component';
// import _ from "lodash";

@Component({
  selector: 'app-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.css'],
  providers: [ClientComponent]
})
export class BackofficeComponent {
  public user;
  private info;
  public notify = {
    referals: 0,
    orders: 0,
    payments: 0,
    gifts: 0,
    requests: 0,
  };

  constructor(
    private router: Router,
    private clientComponent: ClientComponent
  ) {
    clientComponent.userAuth$.subscribe(
      user => {
        if (!user) {
          return this.router.navigate(['/login']);
        }

        this.user = user;
        if (this.user.isBuisnessOwner) {
          return this.router.navigate(['/404']);
        }

        this.getUserNotify(this.user._id);
        this.subscribeNotification();
      });
  }

  private getUserNotify(id: string) {
    this.clientComponent._apiService.getUserNotify(this.clientComponent.jwtToken, id).subscribe(
      data => {
        this.notify = data.notify;
      },
      err => console.error(err)
    );
  }

  public logout() {
    localStorage.clear();
    window.location.href = '/';
    // this.router.navigate(['/']);
  }

  private subscribeNotification() {
    this.clientComponent._socketService.getNotification().subscribe(
      data => {
        this.info = data;
        if (this.info.type === 'updateNotifyStatus') {
          if (this.info.message === this.user._id) {
            this.getUserNotify(this.user._id);
          }
        }
      }
    );
  }

}
