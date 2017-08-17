import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-backoffice-balance-add-request',
  templateUrl: './backoffice-balance-add-request.component.html'
})
export class BackofficeBalanceAddRequestComponent {

  public balance: any;
  public newRequest: any;
  constructor(private dialogRef: MdDialogRef<any>) {
    this.newRequest = {
      value: 0,
      siteId: ''
    };
  }

  public addRequest() {
    if (this.newRequest.value > this.balance.balance) {
      this.newRequest.value = this.balance.balance;
    }
    this.newRequest.siteId = this.balance.siteId;
    this.dialogRef.close(this.newRequest);
  }

};
