import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ClientComponent } from '../../app/client.component';

@Component({
  selector: 'app-get-consultation-modal',
  templateUrl: './get-consultation-modal.component.html',
  styleUrls: ['./get-consultation-modal.component.css']
})
export class GetConsultationModalComponent implements OnInit {
  public ask = {
    name: '',
    phone: '',
    message: '',
    email: ''
  };
  public formIsSended = false;
  public error = '';

  constructor(
    private dialogRef: MdDialogRef<any>,
    private clientComponent: ClientComponent,
  ) { }
  ngOnInit() {
    
  }
  public askFormValidation() {
    if (this.ask.name && this.ask.phone && this.ask.email ){
      return true;
    }
    else {
      return false;
    }
  }
  public close() {
    this.dialogRef.close();
  }
  public onAskFormSubmit(form){
    this.clientComponent._apiService.sendQuestionMail(form).subscribe(
      data => {
        if(data.status === 'ok'){
          this.error = '';
          this.formIsSended = true;
          this.ask = {
            name: '',
            phone: '',
            message: '',
            email: ''
          }
        }
        else{
          this.error = 'Ошибка отправки заявки';
        }
      }
    );
  }
}
