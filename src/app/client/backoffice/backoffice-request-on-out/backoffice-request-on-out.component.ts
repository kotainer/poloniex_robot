import { Component } from '@angular/core';
import { ClientComponent } from '../../app/client.component';

@Component({
  selector: 'app-backoffice-request-on-out',
  templateUrl: './backoffice-request-on-out.component.html',
  styleUrls: ['./../backoffice.component.css'],
  providers: [ClientComponent]
})
export class BackofficeRequestOnOutComponent {
  public user: any;
  public requests: any;

  columns = [
    { prop: 'shopOrderId', name: 'Номер' },
    { prop: 'date', name: 'Дата' },
    { prop: 'value', name: 'Сумма' },
    { prop: 'siteId.name', name: 'Компания' },
    { prop: 'status', name: 'Статус' }
  ];

  constructor(private clientComponent: ClientComponent) {
    clientComponent.userAuth$.subscribe(
      user => {
        this.user = user;
        this.getRequests();
      });
  }

  private getRequests() {
    this.clientComponent._apiService.getUserRequests(this.clientComponent.jwtToken, this.user._id).subscribe(
      data => {
        this.requests = data;
      },
      err => {
        this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

}
