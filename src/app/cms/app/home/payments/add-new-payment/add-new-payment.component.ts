import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-add-new-payment',
  templateUrl: './add-new-payment.component.html',
  styleUrls: ['./add-new-payment.component.css']
})
export class AddNewPaymentComponent implements OnInit {
  paymentType: any;
  stateCtrl: FormControl;
  filteredStates: any;

  states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];

constructor( private dialogRef: MdDialogRef<any> ) {
  this.stateCtrl = new FormControl();
  this.filteredStates = this.stateCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterStates(name));
}

ngOnInit() {
  this.paymentType = 'refill'
}

 filterStates(val: string) {
   return val ? this.states.filter(s => new RegExp(`^${val}`, 'gi').test(s))
              : this.states;
 }
 public close() {
   this.dialogRef.close(null);
 }

}
