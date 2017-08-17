import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-backoffice-send-company-invite',
  templateUrl: './backoffice-send-company-invite.component.html',
})
export class BackofficeSendCompanyInviteComponent {
  public email = '';

  constructor(private dialogRef: MdDialogRef<any>) { }

  public sendInvite() {
     this.dialogRef.close(this.email);
  }
}
