import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientComponent } from '../../app/client.component';

@Component({
  selector: 'app-backoffice-profile',
  templateUrl: './backoffice-profile.component.html',
  styleUrls: ['./../backoffice.component.css'],
  providers: [ClientComponent]
})
export class BackofficeProfileComponent {
  public user;
  public dpDate;
  public sex;

  constructor(
    private router: Router,
    private clientComponent: ClientComponent
  ) {
    this.sex = 'male';
    clientComponent.userAuth$.subscribe(
      user => {

        if (!user) {
          return this.router.navigate(['/login']);
        }

        this.user = user;

        if (this.user.sex) {
          this.sex = this.user.sex;
        }

        if (this.user.dob) {
          this.dpDate = new Date(this.user.dob);
        }

      });
  }
  public saveUserInfo() {
    if (this.dpDate) {
      this.user.dob = this.dpDate;
    }
    this.user.sex = this.sex;

    this.clientComponent._apiService.saveUserInfo(this.clientComponent.jwtToken, this.user).subscribe(
      data => {
        this.clientComponent._notificationsService.success('Данные успешно обновлены', '');
      },
      err => {
        this.clientComponent._notificationsService.error('Ошибка при сохранении', '');
      }
    );
  }

  public triggerFile(fileInput: HTMLElement) {
    fileInput.click();
  }

  public fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.clientComponent._apiService.attachPhoto(
        this.clientComponent.jwtToken, fileList[0], this.user._id, 'user').subscribe(
        data => {
          this.user.photo = data.photo;
          this.clientComponent._notificationsService.success('Фото успешно загружено', '');
        },
        err => {
          this.clientComponent._notificationsService.error('Ошибка при загрузке фото', '');
        }
      );

    }
  }

}
