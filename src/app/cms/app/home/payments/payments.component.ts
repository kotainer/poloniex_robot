import { Component } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { AddNewPaymentComponent } from './add-new-payment/add-new-payment.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {
  paymentType: any;
  constructor( private dialog: MdDialog ) { }

  addPayment() {
    const dialogRef = this.dialog.open(AddNewPaymentComponent, {
      width: '600px'
    });
  }
}
