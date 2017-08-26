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
import * as moment from 'moment';

import { ApiService } from './services/api.service';
import { SocketService } from './services/socket.service';

import { CMSComponent } from './cms.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './home/settings/settings.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';

const cmsRoutes: Routes = [
  { path: '', component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  entryComponents: [
  ],
  declarations: [
    CMSComponent,
    LoginComponent,
    HomeComponent,
    PageNotFoundComponent,
    SettingsComponent,
    DashboardComponent,
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
