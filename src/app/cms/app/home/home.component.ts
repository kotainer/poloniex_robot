import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CMSComponent } from '../cms.component';
import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';
import { MdSidenav } from '@angular/material';

@Component({
  selector: 'cms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('sidenav') sidenav: MdSidenav;
  settingsVisible: any;
  public options = {
    timeOut: 5000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: false,
    preventLastDuplicates: 'visible',
    rtl: false,
    animate: 'scale',
    position: ['right', 'top']
  };

  constructor(
    private router: Router,
    public _notificationsService: NotificationsService,
    public cmsComponent: CMSComponent,
  ) { }

  public logout() {
    localStorage.clear();
    this.cmsComponent.isAuth = false;
    this.cmsComponent.jwtToken = null;
    this.router.navigate(['/login']);
  }
  menuStrategy() {
    if(document.documentElement.clientWidth < 767){
      this.sidenav.close()
    }
  }

}
