import { Component, OnInit } from '@angular/core';
import { CMSComponent } from '../../cms.component';

@Component({
  selector: 'cms-bills',
  templateUrl: './bills.component.html',
})
export class BillsComponent implements OnInit {
  public bills;
  public admin: any;
  public query = {
    isPaymed: 'false',
    createdDate: {
      $gte: '',
      $lte: '',
    },
  };

  constructor(
    private cmsComponent: CMSComponent,
  ) { }

  ngOnInit() {
    this.getList();
  }

  public getList() {
    this.cmsComponent._apiService.getBillsList(this.cmsComponent.jwtToken, this.query).subscribe(
      data => {
        this.bills = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public payBill(bill) {
    this.cmsComponent._apiService.payBill(this.cmsComponent.jwtToken, bill._id).subscribe(
      data => {
        this.getList();
        this.cmsComponent._notificationsService.success('Счёт успешно оплачен', '');
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

}
