import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css']
})
export class AdminsAddNewUserComponent implements OnInit {

  constructor( private dialogRef: MdDialogRef<any> ) { }

  ngOnInit() {
  }
  public close() {
    this.dialogRef.close(null);
  }

}
