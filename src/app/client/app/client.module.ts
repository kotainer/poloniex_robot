import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { ScrollToModule } from 'ng2-scroll-to';
import { ClientComponent } from './client.component';
import { LoginComponent } from '../login/login.component';
import { PageNotFoundComponent } from '../page-not-found-component/page-not-found.component';
import { LandingComponent } from '../landing/landing.component';
import { CKEditorModule } from 'ng2-ckeditor';

import { ApiService } from './services/api.service';
import { SocketService } from './services/socket.service';

import { BackofficeComponent } from '../backoffice/backoffice.component';
import { BackofficeProfileComponent } from '../backoffice/backoffice-profile/backoffice-profile.component';
import { BackofficeBalanceComponent } from '../backoffice/backoffice-balance/backoffice-balance.component';
import { BackofficeReferersComponent } from '../backoffice/backoffice-referers/backoffice-referers.component';
import { BackofficeOrdersComponent } from '../backoffice/backoffice-orders/backoffice-orders.component';
import { BackofficeCompaniesListComponent } from '../backoffice/backoffice-companies-list/backoffice-companies-list.component';
import { BackofficePromotionsListComponent } from '../backoffice/backoffice-promotions-list/backoffice-promotions-list.component';
import { BackofficePaymentsComponent } from '../backoffice/backoffice-payments/backoffice-payments.component';
import { BackofficeRequestOnOutComponent } from '../backoffice/backoffice-request-on-out/backoffice-request-on-out.component';
import { BackofficeBalanceAddRequestComponent } from '../backoffice/backoffice-balance/backoffice-balance-add-request/backoffice-balance-add-request.component';
import { BackofficeAccrualsHistoryComponent } from '../backoffice/backoffice-accruals-history/backoffice-accruals-history.component';
import { ShareLinkComponent } from '../backoffice/backoffice-promotions-list/share-link/share-link.component';
import { BackofficeSendCompanyInviteComponent } from '../backoffice/backoffice-companies-list/backoffice-send-company-invite/backoffice-send-company-invite.component';

import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

import { SafeHtml } from '../backoffice/backoffice-promotions-list/backoffice-promotions-list.component';
import { InviteBussinesModalComponent } from '../landing/invite-bussines-modal/invite-bussines-modal.component';
import { GetConsultationModalComponent } from '../landing/get-consultation-modal/get-consultation-modal.component';

const appRoutes: Routes = [
  {
    path: 'backoffice', component: BackofficeComponent,
    children: [
      { path: '', component: BackofficeProfileComponent },
      { path: 'balance', component: BackofficeBalanceComponent },
      { path: 'referers', component: BackofficeReferersComponent },
      { path: 'orders', component: BackofficeOrdersComponent },
      { path: 'companies', component: BackofficeCompaniesListComponent },
      { path: 'promo', component: BackofficePromotionsListComponent },
      { path: 'payments', component: BackofficePaymentsComponent },
      { path: 'accruals', component: BackofficeAccrualsHistoryComponent },
      { path: 'requests', component: BackofficeRequestOnOutComponent }
    ]
  },
  { path: '', component: LandingComponent },
  { path: 'login', component: LandingComponent },
  { path: 'register', component: LandingComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  entryComponents: [
    LoginComponent,
    BackofficeBalanceAddRequestComponent,
    ShareLinkComponent,
    BackofficeSendCompanyInviteComponent,
    InviteBussinesModalComponent,
    GetConsultationModalComponent,
  ],
  declarations: [
    ClientComponent,
    PageNotFoundComponent,
    LoginComponent,
    LandingComponent,
    BackofficeComponent,
    BackofficeProfileComponent,
    BackofficeBalanceComponent,
    BackofficeReferersComponent,
    BackofficeOrdersComponent,
    BackofficeCompaniesListComponent,
    BackofficePromotionsListComponent,
    BackofficePaymentsComponent,
    BackofficeRequestOnOutComponent,
    BackofficeBalanceAddRequestComponent,
    BackofficeAccrualsHistoryComponent,
    ShareLinkComponent,
    BackofficeSendCompanyInviteComponent,
    SafeHtml,
    InviteBussinesModalComponent,
    GetConsultationModalComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    MdNativeDateModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule,
    ClipboardModule,
    ReCaptchaModule,
    ScrollToModule.forRoot(),
    CKEditorModule
  ],
  providers: [
    ApiService,
    SocketService,
    NotificationsService,
    Title
  ],
  bootstrap: [ClientComponent]
})
export class ClientAppModule { }
