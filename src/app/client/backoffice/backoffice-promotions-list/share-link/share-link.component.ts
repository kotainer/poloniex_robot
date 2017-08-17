import { Component, OnInit } from '@angular/core';
import { ClientComponent } from '../../../app/client.component';

@Component({
  selector: 'app-share-link',
  templateUrl: './share-link.component.html',
  providers: [ClientComponent]
})
export class ShareLinkComponent implements OnInit {

  public sharedItemLink = '';

  constructor(private clientComponent: ClientComponent) { }

  ngOnInit() {
  }

  public copyToClipboard() {
    this.clientComponent._notificationsService.success('Данные успешно скопированы в буфер обмена', '');
  }

}
