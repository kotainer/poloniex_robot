import { Component, OnInit } from '@angular/core';
import { CMSComponent } from '../../cms.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  public settings = {
    _id: '',
    body: {
      receiver: '',
      inn: '',
      kpp: '',
      account: '',
      bank: '',
      bankBic: '',
      corAccount: '',
    }
  };

  constructor(public cmsComponent: CMSComponent) {}

  ngOnInit() {
    this.getSettingsPage();
  }

  private getSettingsPage() {
    this.cmsComponent._apiService.getSettingsByTag(this.cmsComponent.jwtToken, 'payments').subscribe(
      result => {
        if (result) {
          this.settings = _.merge(this.settings, result);
        }
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public saveSettings() {
    this.cmsComponent._apiService.updateSettings(this.cmsComponent.jwtToken,
      this.settings._id, this.settings).subscribe(
      result => {
        this.cmsComponent._notificationsService.success('Настройки успешно сохранены', '');
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

}
