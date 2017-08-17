import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ApiService } from '../app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  public password = '';
  public login = '';
  public error;
  public flag = 'login';
  public registerValues = {
    email: '',
    login: '',
    referal: '',
    password: '',
    isBuisnessOwner: false,
  };
  public restoreEmail = '';
  public response;

  constructor(
    private _apiService: ApiService,
    private router: Router,
    private dialogRef: MdDialogRef<any>
  ) { }

  public changeFlag(newFlag) {
    this.error = null;
    this.flag = newFlag;
  }

  public onLoginSubmit() {
    if (this.login === '' || this.password === '') {
      this.error = 'Заполните все поля';
    } else {
      this.auth();
    }
  }

  public onRegisterSubmit() {
    if (this.registerValues.login === '' || this.registerValues.password === ''
      || this.registerValues.email === '') {
      this.error = 'Заполните все поля';
    } else {
      this.register();
    }
  }


  public auth() {
    this._apiService.login(this.login, this.password).subscribe(
      data => {
        if (data.status === 'OK') {
          localStorage.setItem('sarafanToken', data.token);
          this.dialogRef.close();
          this.router.navigate(['/backoffice']);
        } else {
          this.error = data.error;
        }
      },
      err => {
        this.error = 'Логин или пароль неверен';
      }
    );
  }

  public register() {
    this._apiService.register(this.registerValues).subscribe(
      data => {
        this.login = this.registerValues.login;
        this.password = this.registerValues.password;
        this.auth();
        if (!this.registerValues.isBuisnessOwner) {
          // eval('new Ya.Metrika({id: 45090975}).reachGoal("reguser"); console.log("reguser")');
        } else {
          // eval('new Ya.Metrika({id: 45090975}).reachGoal("regbusiness"); console.log("regbusiness")');
        }
      },
      err => {
        if (err.status === 402) {
          this.error = err._body;
        } else {
          this.error = 'Указанный логин или адрес email уже занят';
        }
      }
    );
  }

  public restorePassword() {
    this._apiService.restorePass(this.restoreEmail).subscribe(
      data => {
        this.error = null;
        this.response = data.message;
        this.flag = 'restoreOK';
      },
      err => {
        if (err.status === 404) {
          this.error = err._body;
        } else {
          this.error = 'Внутренняя ошибка сервера';
        }
      }
    );
  }
  public close() {
    this.dialogRef.close();
  }

}
