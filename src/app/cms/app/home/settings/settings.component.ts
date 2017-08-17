import { Component, OnInit } from '@angular/core';
import { CMSComponent } from '../../cms.component';
import * as _ from 'lodash';

@Component({
  selector: 'cms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public settings = {
    _id: '',
    body: {
      email: {
        email: '',
        smtp: '',
        login: '',
        password: '',
      },
      other: {
        adminEmail: '',
        orderEmail: '',
      },
      seo: {
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
      },
      js: {
        metaGoogle: '',
        metaYandex: '',
        code: '',
      },
      contacts: {
        userAddress: '',
        userPhone: '',
        userEmail: '',
      }
    }
  };

  constructor(public cmsComponent: CMSComponent) {}

  ngOnInit() {
    this.getSettingsPage();
  }

  private getSettingsPage() {
    this.cmsComponent._apiService.getSettingsByTag(this.cmsComponent.jwtToken, 'main').subscribe(
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
