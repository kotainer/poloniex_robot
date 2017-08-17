import { Component, ViewContainerRef } from '@angular/core';
import { ClientComponent } from '../../app/client.component';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { BackofficeSendCompanyInviteComponent } from './backoffice-send-company-invite/backoffice-send-company-invite.component';

@Component({
    selector: 'app-backoffice-companies-list',
    templateUrl: './backoffice-companies-list.component.html',
    styleUrls: ['./../backoffice.component.css'],
    providers: [ClientComponent]
})
export class BackofficeCompaniesListComponent {

    public companies;
    public user;

    constructor(
        public dialog: MdDialog,
        public viewContainerRef: ViewContainerRef,
        private clientComponent: ClientComponent
    ) {
        clientComponent.userAuth$.subscribe(
            user => {
                this.user = user;
                this.getCompanies();
            }
        );
    };

    private getCompanies() {
        this.clientComponent._apiService.getCompaniesList().subscribe(
            data => {
                this.companies = data;
            },
            err => {
                this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
            }
        );
    };

    public subscribe(company) {
        this.clientComponent._apiService.subscribeToCompany(
            this.clientComponent.jwtToken, this.user._id, company._id).subscribe(
            data => {
                this.user.subscribeCompanies.push(company._id);
                this.clientComponent._notificationsService.success('Компания успешно подключена', '');
            },
            err => {
                this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
            }
        );
    };

    public unsubscribe(company) {
        this.clientComponent._apiService.unsubscribeCompany(
            this.clientComponent.jwtToken, this.user._id, company._id).subscribe(
            data => {
                this.user = data;
                this.clientComponent._notificationsService.success('Компания успешно отключена', '');
            },
            err => {
                this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
            }
        );
    };

    public isSubscribe(company) {
        if (this.user.subscribeCompanies.indexOf(company._id) !== -1) {
            return true;
        } else {
            return false;
        }
    };

    public openInviteModal() {
        const config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        const dialogRef = this.dialog.open(BackofficeSendCompanyInviteComponent, config);

        dialogRef.afterClosed().subscribe(email => {
            if (email) {
                this.clientComponent._apiService.sendCompanyInvite(email).subscribe(
                    data => {
                        this.clientComponent._notificationsService.success('Приглашение успешно отправлено', '');
                        eval('new Ya.Metrika({id: 45090975}).reachGoal("invite"); console.log("invite")');
                    },
                    err => {
                        this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
                    }
                );
            }
        });
    }

}
