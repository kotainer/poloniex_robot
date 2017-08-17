import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CMSComponent } from '../../cms.component';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

import { AddNewRateComponent } from './add-new-rate/add-new-rate.component';
import { UpdateRateComponent } from './update-rate/update-rate.component';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  public tariffs;

  constructor(
    private cmsComponent: CMSComponent,
    public dialog: MdDialog,
    public viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
    this.getTariffsList();
  }

  private getTariffsList() {
    this.cmsComponent._apiService.getTariffsList(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.tariffs = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  private addTariff(tariff: any) {
    this.cmsComponent._apiService.addTariff(this.cmsComponent.jwtToken, tariff).subscribe(
      data => {
        this.cmsComponent._notificationsService.success('Тариф успешно добавлен', '');
        this.getTariffsList();
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при добавлении данных', '');
      }
    );
  }

  private updateTariff(tariff: any) {
    this.cmsComponent._apiService.getTariffsList(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.cmsComponent._notificationsService.success('Тариф успешно обновлён', '');
        this.getTariffsList();
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при обновлении данных', '');
      }
    );
  }

  public openAddModal() {
    const config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    const dialogRef = this.dialog.open(AddNewRateComponent, config);

    dialogRef.afterClosed().subscribe(newTariff => {
      if (newTariff) {
        this.addTariff(newTariff);
      }
    });
  }


  public openEditModal(tariff: any) {
    const config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    const dialogRef = this.dialog.open(UpdateRateComponent, config);

    dialogRef.componentInstance.tariff = tariff;

    dialogRef.afterClosed().subscribe(updatedTariff => {
      if (updatedTariff) {
        this.updateTariff(updatedTariff);
      }
    });
  }

  public copyTariff(tariff: any) {
    const newTariff = {
      name: `${tariff.name} копия`,
      description: tariff.description,
      price: tariff.price,
    };

    this.cmsComponent._apiService.addTariff(this.cmsComponent.jwtToken, newTariff).subscribe(
      data => {
        this.cmsComponent._notificationsService.success('Тариф успешно копирован', '');
        this.getTariffsList();
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при копировании данных', '');
      }
    );
  };

  public removeTariff(tariff: any) {
    this.cmsComponent._apiService.removeTariff(this.cmsComponent.jwtToken, tariff._id).subscribe(
      data => {
        this.cmsComponent._notificationsService.success('Тариф успешно удалён', '');
        this.getTariffsList();
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при удалении данных', '');
      }
    );
  }

}
