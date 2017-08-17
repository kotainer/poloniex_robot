import { Component } from '@angular/core';
import { ClientComponent } from '../../app/client.component'

@Component({
  selector: 'app-backoffice-referers',
  templateUrl: './backoffice-referers.component.html',
  styleUrls: ['./../backoffice.component.css'],
  providers: [ClientComponent]
})
export class BackofficeReferersComponent {
  public user;
  public referers;

  columns = [
    { prop: 'login', name: 'Логин' },
    { prop: 'photo', name: 'Фото' },
    { prop: 'name', name: 'ФИО' },
    { prop: 'email', name: 'Email' },
    { prop: 'phone', name: 'Телефон' },
    { prop: 'city', name: 'Город' },
    { prop: 'oborot', name: 'Оборот сети' },
    { prop: 'qualification', name: 'Квалификация' }
  ];

  constructor(
    private clientComponent: ClientComponent
  ) {
    clientComponent.userAuth$.subscribe(
      user => {
        this.user = user;

        this.clientComponent._apiService.getReferers(this.clientComponent.jwtToken, this.user._id).subscribe(
          data => {
            this.referers = data;
            this.clientComponent.setUserNotifyViewed('referers');
          },
          err => {
            this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
          }
        );

      });
  }

}
