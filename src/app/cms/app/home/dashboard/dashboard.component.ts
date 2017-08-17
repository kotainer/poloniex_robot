import { Component, OnInit } from '@angular/core';
import { CMSComponent } from '../../cms.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  public shareChartLabels: string[] = ['vk', 'fb', 'tw'];
  public shareChartData: number[] = [350, 450, 125];
  public shareChartType = 'doughnut';

  public userTypeChartLabels: string[] = ['Пользователь', 'Магазин'];
  public userTypeChartData: number[] = [350, 450];
  public userTypeChartType = 'doughnut';

  public monthChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public monthChartLabels: string[] = [
    'Янв', 'Фев', 'Мрт', 'Апр', 'Май', 'Июн', 'Июл',
    'Авг' , 'Сент' , 'Окт', 'Нбр', 'Дек'
    ];
  public monthChartType = 'bar';
  public monthChartLegend = true;

  public monthChartData: any[] = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Переходы'},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Заказы'}
  ];

  public lastUsers;
  public lastOrders;
  public users = {
    all: 0,
    today: 0,
    yesterday: 0,
    currMonth: 0,
    prevMonth: 0,
    allTurn: 0,
  };

  public orderStatuses = {
    pending: 'Ожидает',
    approved: 'Подтверждён',
    declined: 'Отклонён'
  };

  constructor(private cmsComponent: CMSComponent) { }

  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  ngOnInit() {
    this.getLastUsers();
    this.getUsersStats();
    this.getConvers();
    this.getLastOrders();
    this.getShareStats();
  }

  public getLastUsers() {
    this.cmsComponent._apiService.getLastUsers(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.lastUsers = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getLastOrders() {
    this.cmsComponent._apiService.getLastOrders(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.lastOrders = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getUsersStats() {
    this.cmsComponent._apiService.getUsersStats(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.users = data;
        this.userTypeChartData = [data.users, data.shops];
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getConvers() {
    this.cmsComponent._apiService.getConvers(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.monthChartData = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getShareStats() {
    this.cmsComponent._apiService.getShareStats(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.shareChartData = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

}
