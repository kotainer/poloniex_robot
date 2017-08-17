import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { CMSComponent } from '../cms.component';

@Component({
  selector: 'cms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  public password = '';
  public login = '';
  public error;

  constructor(
    private router: Router,
    private _apiService: ApiService,
    public cmsComponent: CMSComponent
  ) { }

  public onLoginSubmit() {
    if (this.login === '' || this.password === '') {
      this.error = 'Заполните все поля';
    } else {
      this.auth();
    }
  }

  public auth() {
    this._apiService.login(this.login, this.password).subscribe(
      data => {
        if (data.status === 'OK') {
          localStorage.setItem('vitalCMSToken', data.token);
          this.cmsComponent.jwtToken = data.token;
          this.cmsComponent.isAuth = true;
          this.router.navigate(['/dashboard']);
        } else {
          this.error = data.error;
        }
      },
      err => {
        this.error = 'Логин или пароль неверен';
      }
    );
  }

}
