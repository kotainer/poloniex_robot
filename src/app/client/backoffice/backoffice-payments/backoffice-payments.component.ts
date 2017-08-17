import { Component } from '@angular/core';
import { ClientComponent } from '../../app/client.component';

@Component({
  selector: 'app-backoffice-payments',
  templateUrl: './backoffice-payments.component.html',
  styleUrls: ['./../backoffice.component.css'],
  providers: [ClientComponent]
})
export class BackofficePaymentsComponent {

  public user: any;
  public payments: any;

  columns = [
    { prop: 'shopOrderId', name: 'Номер' },
    { prop: 'date', name: 'Дата' },
    { prop: 'value', name: 'Сумма' },
    { prop: 'siteId.name', name: 'Компания' },
    { prop: 'target.payments.execute', name: 'Описание' },
  ];

  constructor(private clientComponent: ClientComponent) {
    clientComponent.userAuth$.subscribe(
      user => {
        this.user = user;
        this.getPayments();
      });
  }

  private getPayments() {
    this.clientComponent._apiService.getUserPayments(this.clientComponent.jwtToken, this.user._id).subscribe(
      data => {
        this.payments = data;
        this.clientComponent.setUserNotifyViewed('payments');
      },
      err => {
        this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

}
