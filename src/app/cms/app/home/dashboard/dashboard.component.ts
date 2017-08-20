import { Component, OnInit } from '@angular/core';
import { CMSComponent } from '../../cms.component';
import * as moment from 'moment';
moment.locale('ru');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  public shareChartLabels: string[] = ['один', 'второй', 'третий'];
  public shareChartData: number[] = [350, 450, 125];
  public shareChartType = 'doughnut';

  public userTypeChartLabels: string[] = ['Баланс', 'Займы'];
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
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Курс BTC'},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Средняя ставка займов'}
  ];

  public completeBalances;
  public availableBalances;
  public openLoansOffer;
  public average;
  public activeLoans;
  public lastLoans;
  public landingBTCBalance = 0;

  public users = {
    all: 0,
    today: 0,
    yesterday: 0,
    currMonth: 0,
    prevMonth: 0,
    allTurn: 0,
  };

  public autoRenew = {
    0: 'Отключено',
    1: 'Включено',
  };

  constructor(private cmsComponent: CMSComponent) { }

  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  ngOnInit() {
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, 15000);
  }

  public refresh() {
    this.getCompleteBalances();
    this.getAvailableBalances();
    this.getOpenLoansOffer();
    this.getActiveLoansOffer();
    this.getAverage();
    this.getLastLoans();
  }

  public getAvailableBalances() {
    this.cmsComponent._apiService.getAvailableBalances(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.availableBalances = data;
        if (Array.isArray(this.availableBalances.lending) && this.availableBalances.lending[0].balance) {
          this.landingBTCBalance = this.availableBalances.lending[0].balance;
        }
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getCompleteBalances() {
    this.cmsComponent._apiService.getCompleteBalances(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.completeBalances = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getOpenLoansOffer() {
    this.cmsComponent._apiService.getOpenLoansOffer(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.openLoansOffer = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getActiveLoansOffer() {
    this.cmsComponent._apiService.getActiveLoansOffer(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.activeLoans = data.provided;        ;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getAverage() {
    this.cmsComponent._apiService.getAverageRate(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.average = data.average.toFixed(8);
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getLastLoans() {
    this.cmsComponent._apiService.getLastLoans(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.lastLoans = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public cancelLoanOffer(loanId) {
    this.cmsComponent._apiService.cancelLoanOffer(this.cmsComponent.jwtToken, loanId).subscribe(
      data => {
        this.cmsComponent._notificationsService.success('Предложение успешно отменено', '');
        this.getOpenLoansOffer();
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при отмене предложения', '');
      }
    );
  }

  public calculateRamain(loan) {

    const startDate = moment(loan.date);
    const endDate = moment(loan.date).add(parseInt(loan.duration), 'days');

    return startDate.to(endDate);
  }

}
