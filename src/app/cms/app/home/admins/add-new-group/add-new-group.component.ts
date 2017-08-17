import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

@Component({
  selector: 'app-add-new-group',
  templateUrl: './add-new-group.component.html',
  styleUrls: ['./add-new-group.component.css']
})
export class AdminsAddNewGroupComponent implements OnInit {

  constructor( private dialogRef: MdDialogRef<any> ) { }

  ngOnInit() {
  }
  public close() {
    this.dialogRef.close(null);
  }


}
