import { Component, OnInit, ViewChild } from '@angular/core';
import { CMSComponent } from '../../cms.component';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import * as moment from 'moment';
moment.locale('ru');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chartAverageLoanDays: BaseChartDirective;

  public userTypeChartLabels: string[] = ['Баланс', 'Займы'];
  public userTypeChartData: number[] = [0, 0];
  public userTypeChartType = 'doughnut';

  public averageLoanDaysOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public averageLoanDaysLabels: string[] = [];
  public averageLoanDaysType = 'bar';
  public averageLoanDaysLegend = true;

  public averageLoanDaysData: any[] = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Средняя ставка займов'},
  ];

  public completeBalances: any;
  public availableBalances: any;
  public openLoansOffer: any;
  public average: any;
  public activeLoans: any;
  public lastLoans: any;
  public coinsPrice = {
    USDT_BTC: {
      last: 0,
      percentChange: 0,
    },
  };
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

  private daysIsBusy = false;

  constructor(private cmsComponent: CMSComponent) { }

  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  ngOnInit() {
    this.refresh();
    this.getAverageDayRate();
    setInterval(() => {
      this.refresh();
      this.calculateRatio();
    }, 20000);
  }

  public refresh() {
    this.getCompleteBalances();
    this.getAvailableBalances();
    this.getOpenLoansOffer();
    this.getActiveLoansOffer();
    this.getAverage();
    this.getLastLoans();
    this.getCoinsPrice();
  }

  public getAvailableBalances() {
    this.cmsComponent._apiService.getAvailableBalances(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.availableBalances = data;
        if (Array.isArray(this.availableBalances.lending)
          && this.availableBalances.lending[0]
          && this.availableBalances.lending[0].balance) {
          this.landingBTCBalance = this.availableBalances.lending[0].balance;
        }
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public calculateRatio() {
    if (!this.activeLoans) {
      return;
    }
    const inLoans = this.activeLoans.reduce((summ: any, el: any) => {
      return parseFloat(summ) + (parseFloat(el.amount) * 100);
    }, 0);
    this.userTypeChartData = [this.landingBTCBalance, inLoans.toFixed(5)];
  }

  public getCompleteBalances() {
    this.cmsComponent._apiService.getCompleteBalances(this.cmsComponent.jwtToken).subscribe(
      data => {
        if (Array.isArray(data) && data.length > 0) {
          this.completeBalances = data;
        }
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getOpenLoansOffer() {
    this.cmsComponent._apiService.getOpenLoansOffer(this.cmsComponent.jwtToken).subscribe(
      data => {
        if (Array.isArray(data) && data.length > 0) {
          this.openLoansOffer = data;
        }
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getActiveLoansOffer() {
    this.cmsComponent._apiService.getActiveLoansOffer(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.activeLoans = data.provided;
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
        if (Array.isArray(data) && data.length > 0) {
          this.lastLoans = data;
        }
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getCoinsPrice() {
    this.cmsComponent._apiService.getCoinsPrice(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.coinsPrice = data;
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

    const startDate = moment();
    const endDate = moment(loan.date).add(parseInt(loan.duration), 'days');

    return startDate.to(endDate);
  }

  public getAverageDayRate() {
    if (this.daysIsBusy) {
      return;
    }
    this.daysIsBusy = true;
    this.cmsComponent._apiService.getAverageDayRate(this.cmsComponent.jwtToken).subscribe(
      data => {
        const labels = [];
        const days = data.reverse();
        const clone = JSON.parse(JSON.stringify(this.averageLoanDaysData));
        clone[0].data = [];
        for (const day of data) {
          labels.push(`${day._id.day}.${day._id.month}.${day._id.year}`);
          clone[0].data.push((day.average * 100).toFixed(5));
        }

        this.averageLoanDaysLabels = labels;
        this.averageLoanDaysData = clone;

        setTimeout(() => {
            if (this.chartAverageLoanDays && this.chartAverageLoanDays.chart
              && this.chartAverageLoanDays.chart.config) {
                this.chartAverageLoanDays.chart.config.data.labels = labels;
                this.chartAverageLoanDays.chart.update();

            }
        });
        this.daysIsBusy = false;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
        this.daysIsBusy = false;
      }
    );
  }

}
