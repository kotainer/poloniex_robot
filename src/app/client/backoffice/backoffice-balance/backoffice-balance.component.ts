import { Component, ViewContainerRef } from '@angular/core';
import { ClientComponent } from '../../app/client.component';
import { BackofficeBalanceAddRequestComponent } from './backoffice-balance-add-request/backoffice-balance-add-request.component';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

@Component({
  selector: 'app-backoffice-balance',
  templateUrl: './backoffice-balance.component.html',
  styleUrls: ['./../backoffice.component.css'],
  providers: [ClientComponent]
})
export class BackofficeBalanceComponent {

  public user;
  public balance: any;
  public summBalance;

  columns = [
    { prop: 'site', name: 'Сайт' },
    { prop: 'balance', name: 'Баланс' }
  ];

  constructor(
    public dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
    private clientComponent: ClientComponent
  ) {
    this.summBalance = 0;
    clientComponent.userAuth$.subscribe(
      user => {
        this.user = user;
        this.getBalance();
      });
  }

  private getBalance() {
    this.clientComponent._apiService.getUserBalance(this.clientComponent.jwtToken, this.user._id).subscribe(
      data => {
        this.summBalance = 0;
        this.balance = data;

        this.balance.forEach(site => {
         this.summBalance += site.balance;
        });

      },
      err => {
        this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public openAddRequestModal(balance) {
    const config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    const dialogRef = this.dialog.open(BackofficeBalanceAddRequestComponent, config);
    dialogRef.componentInstance.balance = balance;

    dialogRef.afterClosed().subscribe(newRequest => {
      if (newRequest) {
        newRequest.userId = this.user._id;
        this.clientComponent._apiService.addRequestOnOut(this.clientComponent.jwtToken, newRequest).subscribe(
          data => {
            this.clientComponent._notificationsService.success('Запрос успешно отправлен', '');
            this.getBalance();
          },
          err => {
            this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
          }
        );
      }
    });
  }

}
