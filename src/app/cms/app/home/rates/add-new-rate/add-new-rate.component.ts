import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-new-rate',
  templateUrl: './add-new-rate.component.html',
  styleUrls: ['./add-new-rate.component.css']
})
export class AddNewRateComponent {
  public item;
  constructor(private dialogRef: MdDialogRef<any>) {
    this.item = {
      name: '',
      description: '',
      price: 0,
    };
  }

  public addNewTariff() {
    if (this.item.name.length > 0
    && this.item.description.length > 0) {
      this.dialogRef.close(this.item);
    }
  }

}
