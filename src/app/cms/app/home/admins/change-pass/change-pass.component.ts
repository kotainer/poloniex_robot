import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class AdminsChangePassComponent implements OnInit {

  constructor( private dialogRef: MdDialogRef<any> ) { }

  ngOnInit() {
  }
  public close() {
    this.dialogRef.close(null);
  }

}
