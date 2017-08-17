import { Component } from '@angular/core';
import { ClientComponent } from '../../app/client.component';

@Component({
  selector: 'app-backoffice-accruals-history',
  templateUrl: './backoffice-accruals-history.component.html',
  styleUrls: ['./../backoffice.component.css'],
  providers: [ClientComponent]
})
export class BackofficeAccrualsHistoryComponent {

  public user: any;
  public accruals: any;

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
        this.getAccruals();
        this.clientComponent.setUserNotifyViewed('payments');
      });
  }

  private getAccruals() {
    this.clientComponent._apiService.getUserAccruals(this.clientComponent.jwtToken, this.user._id).subscribe(
      data => {
        this.accruals = data;
      },
      err => {
        this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

}
