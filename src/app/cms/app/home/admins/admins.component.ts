import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { AdminsAddNewGroupComponent } from './add-new-group/add-new-group.component';
import { AdminsAddNewUserComponent } from './add-new-user/add-new-user.component';
import { AdminsChangePassComponent } from './change-pass/change-pass.component';


@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {

  constructor( private dialog: MdDialog ) { }

  ngOnInit() {
  }

  changePass() {
    const config = new MdDialogConfig();
    const dialogRef = this.dialog.open(AdminsChangePassComponent, config);
  }

  addGroup() {
    const dialogRef = this.dialog.open(AdminsAddNewGroupComponent, {
      width: '900px'
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(AdminsAddNewUserComponent, {
      width: '600px'
    });
  }

}
