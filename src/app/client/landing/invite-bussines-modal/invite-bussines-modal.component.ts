import { Component, OnInit, ViewChild } from '@angular/core';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-invite-bussines-modal',
  templateUrl: './invite-bussines-modal.component.html',
  styleUrls: ['./invite-bussines-modal.component.css']
})

export class InviteBussinesModalComponent implements OnInit {

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;
  private captchaIsValid = false;
  public recaptchaKey = '6LfpjRwUAAAAADuMrYfba7VuWRGv_88UieHQkCNg';
  public email;
  public error;

  constructor(private dialogRef: MdDialogRef<any>) { }

  ngOnInit() {
  }

  public handleCorrectCaptcha(event) {
    this.captchaIsValid = true;
  }
  public validateForm() {
    if (!this.email) {
      this.error = 'Введите email';
    } else if (!this.captchaIsValid && this.email) {
      this.error = 'Подтвердите капчу';
    } else {
      this.error = '';
      this.sendInvintatinMail();
    }
  }
  private sendInvintatinMail() {
    this.dialogRef.close(this.email);
  }
  public close() {
    this.dialogRef.close();
  }

}
