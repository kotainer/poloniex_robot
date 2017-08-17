import { Component, OnInit } from '@angular/core';
import { CMSComponent } from '../../cms.component';

@Component({
  selector: 'cms-accruals',
  templateUrl: './accruals.component.html',
})
export class AccrualsComponent implements OnInit {
  private admin: any;
  public accruals: any;

  public query = {
    createdDate: {
      $gte: '',
      $lte: '',
    },
    $or: '',
  };

  constructor(private cmsComponent: CMSComponent) { 
    cmsComponent.userAuth$.subscribe(
      admin => {
        this.admin = admin;
        this.getAccrualsList();
      });
  }

  public getAccrualsList() {
    this.cmsComponent._apiService.getAccrualsList(this.cmsComponent.jwtToken, this.query).subscribe(
      data => {
        this.accruals = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  ngOnInit() {
    if (! this.accruals) {
      this.getAccrualsList();
    }
  }

}
