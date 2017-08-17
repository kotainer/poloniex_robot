import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { CKEditorModule } from 'ng2-ckeditor';
import { ChartsModule } from 'ng2-charts';

import { ApiService } from './services/api.service';
import { SocketService } from './services/socket.service';

import { CMSComponent } from './cms.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './home/settings/settings.component';
import { AdminsComponent } from './home/admins/admins.component';
import { AdminsAddNewGroupComponent } from './home/admins/add-new-group/add-new-group.component';
import { AdminsAddNewUserComponent } from './home/admins/add-new-user/add-new-user.component';
import { AdminsChangePassComponent } from './home/admins/change-pass/change-pass.component';
import { FilesComponent } from './home/files/files.component';
import { UsersComponent } from './home/users/users.component';
import { StatsComponent } from './home/stats/stats.component';
import { PaymentsComponent } from './home/payments/payments.component';
import { AddNewPaymentComponent } from './home/payments/add-new-payment/add-new-payment.component';
import { UserComponent } from './home/user/user.component';
import { BankComponent } from './home/bank/bank.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { MessagesComponent } from './home/messages/messages.component';
import { RatesComponent } from './home/rates/rates.component';
import { AddNewRateComponent } from './home/rates/add-new-rate/add-new-rate.component';
import { UpdateRateComponent } from './home/rates/update-rate/update-rate.component';
import { AccrualsComponent } from './home/accruals/accruals.component';
import { BillsComponent } from './home/bills/bills.component';


const cmsRoutes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'user/:id', component: UserComponent },
      { path: 'files', component: FilesComponent },
      { path: 'admins', component: AdminsComponent },
      { path: 'bank', component: BankComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'rates', component: RatesComponent},
      { path: 'accruals', component: AccrualsComponent},
      { path: 'bills', component: BillsComponent},
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  entryComponents: [
    AdminsAddNewGroupComponent,
    AdminsAddNewUserComponent,
    AdminsChangePassComponent,
    AddNewPaymentComponent,
    AddNewRateComponent,
    UpdateRateComponent,
  ],
  declarations: [
    CMSComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    SettingsComponent,
    AdminsComponent,
    AdminsAddNewGroupComponent,
    AdminsAddNewUserComponent,
    AdminsChangePassComponent,
    FilesComponent,
    UsersComponent,
    StatsComponent,
    PaymentsComponent,
    AddNewPaymentComponent,
    UserComponent,
    BankComponent,
    DashboardComponent,
    MessagesComponent,
    RatesComponent,
    AddNewRateComponent,
    UpdateRateComponent,
    AccrualsComponent,
    BillsComponent,
  ],
  imports: [
    RouterModule.forRoot(cmsRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule,
    CKEditorModule,
    MdNativeDateModule,
    ChartsModule,
  ],
  providers: [
    ApiService,
    SocketService,
    NotificationsService,
  ],
  bootstrap: [CMSComponent]
})
export class CMSAppModule { }
