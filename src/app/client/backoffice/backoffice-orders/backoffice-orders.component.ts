import { Component } from '@angular/core';
import { ClientComponent } from '../../app/client.component'

@Component({
  selector: 'app-backoffice-orders',
  templateUrl: './backoffice-orders.component.html',
  styleUrls: ['./../backoffice.component.css'],
  providers: [ClientComponent]
})
export class BackofficeOrdersComponent {

  public yourModelDate;
  public yourModelDateEnd;
  public user;
  public orders;

  sources = [
    { value: 'vk', viewValue: 'ВКонтакте' },
    { value: 'fb', viewValue: 'Facebook' },
    { value: 'html', viewValue: 'Прямая ссылка' }
  ];

  statuses = [
    { value: 'approved', viewValue: 'Подтверждён' },
    { value: 'pending', viewValue: 'Ожидает подтверждения' },
    { value: 'declined', viewValue: 'Отклонён' }
  ];

  columns = [
    { prop: 'login', name: 'Номер' },
    { prop: 'date', name: 'Дата' },
    { prop: 'name', name: 'Магазин' },
    { prop: 'phone', name: 'Сумма' },
    { prop: 'phone', name: 'Размер вознаграждения' },
    { prop: 'city', name: 'Источник' },
    { prop: 'qualification', name: 'Статус' }
  ];

  constructor(
    private clientComponent: ClientComponent
  ) {
    clientComponent.userAuth$.subscribe(
      user => {
        this.user = user;
        this.getOrders();
        this.clientComponent.setUserNotifyViewed('orders');
      });
  }

  private getOrders() {
    this.clientComponent._apiService.getUserOrders(this.clientComponent.jwtToken, this.user._id).subscribe(
      data => {
        this.orders = data;
      },
      err => {
        this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

}
