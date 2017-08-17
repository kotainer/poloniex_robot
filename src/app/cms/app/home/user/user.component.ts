import { Component, OnInit } from '@angular/core';
import { CMSComponent } from '../../cms.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  ordersVisible: any;
  financeVisible: any;
  refVisible: any;
  type: any;
  user: any;
  admin: any;
  paymentType: any;
  private sub: any;
  userId: string;
  constructor(
    private router: ActivatedRoute,
    private cmsComponent: CMSComponent,
  ) { }

  private getUser() {
    this.cmsComponent._apiService.getUser(this.cmsComponent.jwtToken, this.userId).subscribe(
      data => {
        this.user = data;
        this.type = this.user.isBuisnessOwner ? 'company' : 'person';
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  ngOnInit() {
    this.sub = this.router.params.subscribe(params => {
      this.userId = params['id'];
    });

    this.type = 'company';

    if (! this.user) {
      this.getUser();
    }
  }

}
