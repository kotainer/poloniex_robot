import { Component, ViewContainerRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { ClientComponent } from '../app/client.component';
import { Router } from '@angular/router';
import { InviteBussinesModalComponent } from './invite-bussines-modal/invite-bussines-modal.component';
import { GetConsultationModalComponent } from './get-consultation-modal/get-consultation-modal.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [ClientComponent]
})
export class LandingComponent implements OnInit {

  public user = null;
  public ask = {
    name: '',
    phone: '',
    message: '',
    email: ''
  };

  constructor(
    public dialog: MdDialog,
    private viewContainerRef: ViewContainerRef,
    private clientComponent: ClientComponent,
    private _router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
    clientComponent.userAuth$.subscribe(
      user => {
        this.user = user;
      });
  }

  ngOnInit() {
    if (this._router.url === '/login') {
      this.openLoginModal('login');
    } else if (this._router.url === '/register') {
      this.openLoginModal('register');
    }
    this.cdRef.detectChanges();
  }
  openLoginModal(flag: string) {
    const config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    const dialogRef = this.dialog.open(LoginComponent, config);
    dialogRef.componentInstance.flag = flag;
  }
  openConsultationModal() {
    const config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;
    const dialogRef = this.dialog.open(GetConsultationModalComponent, config);
  }
  openInviteBussinesModal() {
    const config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;
    const dialogRef = this.dialog.open(InviteBussinesModalComponent, config);
    dialogRef.afterClosed().subscribe(email => {
    if (email) {
        this.clientComponent._apiService.sendCompanyInvite(email).subscribe(
            data => {
                this.clientComponent._notificationsService.success('Приглашение успешно отправлено', '');
                // eval('new Ya.Metrika({id: 45090975}).reachGoal("invite"); console.log("invite")');
            },
            err => {
                this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
            }
        );
    }
  });
}
  public askFormValidation() {
    if (this.ask.name && this.ask.phone && this.ask.message && this.ask.email ){
      return true;
    }
    else {
      return false;
    }
  }
  public onAskFormSubmit(form){
    this.clientComponent._apiService.sendQuestionMail(form).subscribe();
    this.clientComponent._notificationsService.success('Ваше сообщение успешно отправлено', '');
    this.ask = {
      name: '',
      phone: '',
      message: '',
      email: ''
    }
  }
}
