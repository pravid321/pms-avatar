import { Component, OnInit, ViewChild, ModuleWithComponentFactories } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
import { RouteParameterService } from '../../shared/route.parameter.service';
import { DateDataService } from '../services/date.data.service';
import { DataService, CreateEventParams, MoveEventParams } from '../scheduler/data.service';
import { Services } from '@angular/core/src/view';
import * as $ from 'jquery';


@Component({
  selector: 'app-ui-frontdesk',
  templateUrl: './frontdesk.component.html',
  styleUrls: ['./frontdesk.component.scss']
})
export class FrontdeskComponent implements OnInit {

  showPicker:boolean = false;
  dateTab:string = 'custom';
  selectedStartDate: any;
  selectedEndDate: any;

  constructor(private router: Router, private routeParamService: RouteParameterService, private ds: DataService, private dateData: DateDataService) { }

  ngOnInit() {
    this.routeParamService.setParam({
      url: this.router.url,
      pageName: 'Frontdesk'
    });

    this.dateData.currentStartDate.subscribe(stDate => {
      //console.log("in front desk: ", stDate);   
      this.selectedStartDate = moment(stDate.day + ' ' + stDate.month + ' ' + stDate.year, 'D M YYYY').format('DD-MMM-YYYY');
      this.config.startDate = moment(stDate.day + ' ' + stDate.month + ' ' + stDate.year, 'D M YYYY').format('YYYY-MM-DD');
      this.config.days = 15;
      this.config.cellWidth = $('.scheduler_default_scrollable').outerWidth() / this.config.days;
    });

    this.dateData.currentEndDate.subscribe(endDate => {
      //console.log("in front desk: ", moment(this.selectedStartDate, 'DD-MMM-YYYY').diff(moment(endDate.day + ' ' + endDate.month + ' ' + endDate.year, 'D M YYYY')));      
      this.selectedEndDate = moment(endDate.day + ' ' + endDate.month + ' ' + endDate.year, 'D M YYYY').format('DD-MMM-YYYY');

      this.config.days = moment(endDate.day + ' ' + endDate.month + ' ' + endDate.year, 'D M YYYY').diff(moment(this.selectedStartDate, 'DD-MMM-YYYY'), 'days') + 1;
      this.showPicker = false;
      this.config.cellWidth = $('.scheduler_default_scrollable').outerWidth() / this.config.days;
    });
  }

  @ViewChild('scheduler')
  scheduler: DayPilotSchedulerComponent;

  events: any[] = [];
  config: any = {
    timeHeaders: [{ "groupBy": "Month" }, { "groupBy": "Day", "format": "d" }],
    scale: "Day",
    treeEnabled: true,
    //days: DayPilot.Date.today().daysInYear(),
    days: 30,
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    //scrollTo: DayPilot.Date.today().firstDayOfMonth(),
    theme: "scheduler_default",
    durationBarVisible: true,
    cellWidth: 80,
    onTimeRangeSelected: args => {
      let name = prompt("New reservation:", "Guest Name");
      this.scheduler.control.clearSelection();
      if (!name) {
        return;
      }
      let params: CreateEventParams = {
        start: args.start.toString(),
        end: args.end.toString(),
        text: name,
        resource: args.resource
      };
      this.ds.createEvent(params).subscribe(result => {
        this.events.push();
        this.scheduler.control.message("Event created");
      });
    },
    onEventResized: args => {
      console.log("at event resized: ", args);

    },
    onEventMove: args => {
      let params: MoveEventParams = {
        id: args.e.id(),
        start: args.newStart.toString(),
        end: args.newEnd.toString(),
        resource: args.newResource
      };
      this.ds.moveEvent(params).subscribe(result => {
        this.scheduler.control.message("Event moved");
      });
    }
  };

  get durationBarNotSupported(): boolean {
    return this.themes.find(item => item.value === this.config.theme).noDurationBarSupport;
  }

  themes: any[] = [
    { name: "Default", value: "scheduler_default" },
    { name: "Green", value: "scheduler_green" },
    { name: "Traditional", value: "scheduler_traditional" },
    { name: "Transparent", value: "scheduler_transparent" },
    { name: "White", value: "scheduler_white" },
    { name: "Theme 8", value: "scheduler_8", noDurationBarSupport: true }
  ];

  ngAfterViewInit(): void {
    this.ds.getResources().subscribe(result => this.config.resources = result);

    const from = this.scheduler.control.visibleStart();
    const to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
      //console.log("after getting events: ", result);
      this.config.cellWidth = $('.scheduler_default_scrollable').outerWidth() / 15;

    });
  }

  viewChange(args) {
    console.log("in view change: ", args, this.scheduler.control.visibleStart(), this.scheduler.control.visibleEnd());

    // quit if the date range hasn't changed
    if (!args.visibleRangeChanged) {
      return;
    }

    let from = this.scheduler.control.visibleStart();
    let to = this.scheduler.control.visibleEnd();
  }

  setSchedularDateRange(type){   
     
    if(type == '1'){
      this.dateTab = '1';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 1;
      this.showPicker = false;
      this.config.cellWidth = $('.scheduler_default_scrollable').outerWidth();
    }else if(type == '3'){
      this.dateTab = '3';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 3;
      this.showPicker = false;
      this.config.cellWidth = $('.scheduler_default_scrollable').outerWidth() / 3;
    }else if(type == '7'){
      this.dateTab = '7';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 7;
      this.showPicker = false;
      this.config.cellWidth = $('.scheduler_default_scrollable').outerWidth() / 7;
    }else if(type == '15'){
      this.dateTab = '15';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 15;
      this.showPicker = false;
      this.config.cellWidth = $('.scheduler_default_scrollable').outerWidth() / 15;
    }else if(type == 'month'){
      this.dateTab = 'month';
      this.config.startDate = moment().format("YYYY-MM-01");
      this.config.days = moment().daysInMonth();
      this.config.cellWidth = $('.scheduler_default_scrollable').outerWidth() / moment().daysInMonth();
      this.showPicker = false;
    }else if('custom'){
      this.showPicker = true;
    }
    //this.selectedStartDate = moment(stDate.day + ' ' + stDate.month + ' ' + stDate.year, 'D M YYYY').format('DD-MMM-YYYY');
      //this.config.startDate = moment(stDate.day + ' ' + stDate.month + ' ' + stDate.year, 'D M YYYY').format('YYYY-MM-DD');
      //this.config.days = 15;

  }

}
