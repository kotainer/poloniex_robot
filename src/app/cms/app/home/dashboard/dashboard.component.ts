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
  @ViewChild('averageChart') chartAverageLoanDays: BaseChartDirective;
  @ViewChild('balancesChart') balancesChart: BaseChartDirective;

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
    {data: [0], label: 'BTC'},
    {data: [0], label: 'XRP'},
    {data: [0], label: 'DASH'},
    {data: [0], label: 'XMR'},
  ];

  public balancesChartData: Array<any> = [
    {data: [0], label: 'BTC'},
  ];
  public balancesChartLabels: Array<any> = ['Данные не получены'];
  public balancesChartOptions: any = {
    responsive: true
  };
  public balancesChartType = 'line';
  public balancesChartLegend = true;

  public completeBalances: any;
  public availableBalances: any;
  public openLoansOffer: any;
  public average = {
    BTC: 0,
    XRP: 0,
    DASH: 0,
    XMR: 0,
  };
  public activeLoans: any;
  public lastLoans = {
    BTC: [],
    XRP: [],
    DASH: [],
    XMR: [],
  };
  public coinsPrice = {
    USDT_BTC: {
      last: 0,
      percentChange: 0,
    },
  };
  public lendingBalances = {
    BTC: 0,
    XRP: 0,
    DASH: 0,
    XMR: 0,
  };

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
    this.getAverage();
    this.getCoinsBalances();
    setInterval(() => {
      this.refresh();
      this.calculateRatio();
    }, 20000);
  }

  public refreshAll() {
    this.refresh();
    this.getAverageDayRate();
    this.getAverage();
    this.getCoinsBalances();
    this.cmsComponent._notificationsService.info('Данные в процессе обновления ...', '');
  }

  public refresh() {
    this.getCompleteBalances();
    this.getAvailableBalances();
    this.getOpenLoansOffer();
    this.getActiveLoansOffer();
    this.getLastLoans();
    this.getCoinsPrice();
  }

  public getAvailableBalances() {
    this.cmsComponent._apiService.getAvailableBalances(this.cmsComponent.jwtToken).subscribe(
      data => {
        if (data !== {}) {
          this.lendingBalances = data;
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
      return parseFloat(summ) + (parseFloat(el.amount));
    }, 0);
    this.userTypeChartData = [this.lendingBalances.BTC, inLoans.toFixed(5)];
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
        this.average = data;
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getCoinsBalances() {
    this.cmsComponent._apiService.getCoinsBalances(this.cmsComponent.jwtToken).subscribe(
      data => {
        this.balancesChart.datasets = [];
        if (Array.isArray(data.coinsName) && data.coinsName.length === 0) {
          return;
        }

        for (let i = 0; i < data.coinsName.length; i++) {
          this.balancesChart.datasets.push({
            data: data.coinsBalance[i],
            label: data.coinsName[i],
          });
        }

        this.balancesChart.labels = data.labels || [];
        this.balancesChart.ngOnChanges({});
      },
      err => {
        this.cmsComponent._notificationsService.error('Ошибка при получении данных', '');
      }
    );
  }

  public getLastLoans() {
    this.cmsComponent._apiService.getLastLoans(this.cmsComponent.jwtToken).subscribe(
      data => {
        if (Array.isArray(data.BTC) && data.BTC.length > 0) {
          this.lastLoans.BTC = data.BTC;
        }
        if (Array.isArray(data.XMR) && data.XMR.length > 0) {
          this.lastLoans.XMR = data.XMR;
        }
        if (Array.isArray(data.DASH) && data.DASH.length > 0) {
          this.lastLoans.DASH = data.DASH;
        }
        if (Array.isArray(data.XRP) && data.XRP.length > 0) {
          this.lastLoans.XRP = data.XRP;
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
    const endDate = moment(loan.date).add(parseInt(loan.duration, 2), 'days');

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

        const clone = JSON.parse(JSON.stringify(this.averageLoanDaysData));
        clone[0].data = [];
        clone[1].data = [];
        clone[2].data = [];
        clone[3].data = [];

        for (const day of data) {
          labels.push(day.date);
          clone[0].data.push((day.BTC * 100).toFixed(5));
          clone[1].data.push((day.XRP * 100).toFixed(5));
          clone[2].data.push((day.DASH * 100).toFixed(5));
          clone[3].data.push((day.XMR * 100).toFixed(5));
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
