import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CMSComponent } from '../../cms.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  admin: any;
  users: any;
  query = {
    isBuisnessOwner: 'false',
    registryDate: {
      $gte: '',
      $lte: '',
    },
    $or: '',
  };

  constructor(
    private router: Router,
    private cmsComponent: CMSComponent,
   ) {
    cmsComponent.userAuth$.subscribe(
      admin => {
        this.admin = admin;
        this.getUsersList();
      });
  }

  public getUsersList() {
    this.cmsComponent._apiService.getUsersList(this.cmsComponent.jwtToken, this.query).subscribe(
      data => {
        this.users = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  ngOnInit() {
    if (! this.users) {
      this.getUsersList();
    }
  }

  public viewUser(id) {
    this.router.navigate(['/user/' + id]);
  }

  public removeUser(id) {
    this.cmsComponent._apiService.removeUser(this.cmsComponent.jwtToken, id).subscribe(
      data => {
        this.getUsersList();
        this.cmsComponent._notificationsService.success('Пользователь успешно удалён', '');
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при удалении пользователя', '');
      }
    );
  }

  public changeBanStatus(user: any) {
    user.isBanned = !user.isBanned;
    this.cmsComponent._apiService.changeBan(this.cmsComponent.jwtToken, user._id, user.isBanned).subscribe(
      data => {
        this.cmsComponent._notificationsService.success('Пользователь успешно обновлён', '');
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при удалении пользователя', '');
      }
    );
  };

}
