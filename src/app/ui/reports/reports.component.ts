import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataEventService } from '../../shared/data.event.service';
import { ReportsLeftSidebarComponent } from './left-sidebar-panel/reports.left.sidebar.panel.component';
import { RouteParameterService } from '../../shared/route.parameter.service';

import moment from 'moment';

export const reportsChildComponents = [ReportsLeftSidebarComponent];

@Component({
  selector: 'app-ui-reports',
  templateUrl: './reports.component.html',
  styles: [
    '::ng-deep.bs-datepicker { left: 100px; top: 5px; }'
  ]
})
export class ReportsComponent implements OnInit, OnDestroy {

  private eventSubscription: Subscription;

  tariffChartConfigStart: Partial<BsDatepickerConfig>;
  tariffChartConfigEnd: Partial<BsDatepickerConfig>;

  public tcDatePickerStart: any;
  public tcDatePickerEnd: any;

  constructor(
    private _des: DataEventService,
    private router: Router,
    private routeParamService: RouteParameterService
  ) { }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'Reports'
    });

    this.eventSubscription = this._des.currentEvent.subscribe((eventData: any) => {
      console.log("report eventdata: ", eventData);
    });

    this.tariffChartConfigStart = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      minDate: new Date(),
      showWeekNumbers: false
    });

    this.tariffChartConfigEnd = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      minDate: new Date(),
      showWeekNumbers: false
    });

    this.tcDatePickerStart = moment().format('DD-MMM-YYYY');
    this.tcDatePickerEnd = moment().add(6, 'days').format('DD-MMM-YYYY');

  }

  onReportDateChange(value: Date, type: string): void {
    console.log("in onReportDateChange");
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
