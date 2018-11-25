import { Component, OnInit, ViewChild, ModuleWithComponentFactories } from '@angular/core';
import { Router } from '@angular/router';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
import { DaterangePickerComponent } from 'ng2-daterangepicker';

import * as moment from 'moment';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { log } from 'util';

import { DateDataService } from '../services/date.data.service';
import { DataService, CreateEventParams, MoveEventParams } from '../scheduler/data.service';
import { RouteParameterService } from '../../shared/route.parameter.service';
import { FrontDeskService } from '../services/front.desk.services';
import { BookingDetailsComponent } from './bookingdetails/booking.details.component';
import { QuickReservationComponent } from '../scheduler/quick-reservation/quick.reservation.component';
import { IRoom, IRatePlan } from './Frontdesk';



export const frontDeskChildComponents = [BookingDetailsComponent];

@Component({
  selector: 'app-ui-frontdesk',
  templateUrl: './frontdesk.component.html',
  styleUrls: ['./frontdesk.component.scss']
})
export class FrontdeskComponent implements OnInit {

  roomList: IRoom[];
  ratePlanList: IRatePlan[];

  showPicker: boolean = false;
  dateTab: string = 'custom';
  selectedStartDate: any;
  selectedEndDate: any;
  countObservable: any;
  blockedRoomCountCellWidth: number;
  schedulerHeight: number;

  eventBookingData: any;

  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  public daterange: any = {};

  public showBooking: boolean = false;

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  public updateDateRange() {
    this.picker.datePicker.setStartDate('2017-03-27');
    this.picker.datePicker.setEndDate('2017-04-08');
  }

  constructor(private router: Router,
    private routeParamService: RouteParameterService,
    private ds: DataService,
    private dateData: DateDataService,
    private fdData: FrontDeskService) { }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'Frontdesk'
    });

    this.dateData.currentStartDate.subscribe(stDate => {
      //console.log("in front desk: ", stDate);   
      this.selectedStartDate = moment(stDate.day + ' ' + stDate.month + ' ' + stDate.year, 'D M YYYY').format('DD-MMM-YYYY');
      this.config.startDate = moment(stDate.day + ' ' + stDate.month + ' ' + stDate.year, 'D M YYYY').format('YYYY-MM-DD');
      this.config.days = 15;
      this.blockedRoomCountCellWidth = $('.scheduler_default_scrollable').outerWidth() / this.config.days;
      this.countObservable = _.range(this.config.days);

      $(".room-blocked-head").css({
        width: $('.scheduler_default_corner_inner').outerWidth() + 'px'
      });
    });

    this.dateData.currentEndDate.subscribe(endDate => {
      //console.log("in front desk: ", moment(this.selectedStartDate, 'DD-MMM-YYYY').diff(moment(endDate.day + ' ' + endDate.month + ' ' + endDate.year, 'D M YYYY')));      
      this.selectedEndDate = moment(endDate.day + ' ' + endDate.month + ' ' + endDate.year, 'D M YYYY').format('DD-MMM-YYYY');

      this.config.days = moment(endDate.day + ' ' + endDate.month + ' ' + endDate.year, 'D M YYYY').diff(moment(this.selectedStartDate, 'DD-MMM-YYYY'), 'days') + 1;
      this.showPicker = false;
      this.blockedRoomCountCellWidth = ($('.scheduler_default_scrollable').outerWidth() / this.config.days);
      this.dateTab = 'custom';
      this.countObservable = _.range(this.config.days);

      let requestOption = {
        startDate: moment(this.selectedStartDate, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
        endDate: moment(endDate.year + '-' + endDate.month + '-' + endDate.day, 'YYYY-MM-DD').format('YYYY-MM-DD')
      };

      //this.getReservationDetailList(requestOption);
    });

    this.schedulerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $(".frontdesk-header").outerHeight() + $(".fixed-bottom").outerHeight() + 78);
  }

  @ViewChild('scheduler') scheduler: DayPilotSchedulerComponent;
  @ViewChild("create") create: QuickReservationComponent;

  events: any[] = [];
  config: any = {
    timeHeaders: [{ "groupBy": "Day", "format": "dd,dddd" }],
    scale: "Day",
    treeEnabled: true,
    minDate: { year: 2018, month: 10, day: 1 },
    maxDate: { year: 2099, month: 12, day: 31 },
    //days: DayPilot.Date.today().daysInYear(),
    days: 30,
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    //scrollTo: DayPilot.Date.today().firstDayOfMonth(),
    theme: "scheduler_default",
    durationBarVisible: true,
    //cellWidth: 80,
    eventHeight: 45,
    headerHeightAutoFit: false,
    headerHeight: 40,
    heightSpec: "Fixed",
    treePreventParentUsage: true,
    cellWidthSpec: 'Auto',
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Check In",
          image: "./assets/images/guest-lookup-ico.png",
        },
        {
          text: "Check Out",
          image: "./assets/images/guest-lookup-ico.png",
        },
        {
          text: "Payments",
          image: "./assets/images/guest-lookup-ico.png",
        },
        {
          text: "Split Reservation",
          image: "./assets/images/guest-lookup-ico.png",
        },
        {
          text: "View Details",
          image: "./assets/images/guest-lookup-ico.png",
          onClick: args => {
            this.showBookingSection(args);
          }
        },
        {
          text: "Messages/Task",
          image: "./assets/images/guest-lookup-ico.png",
        }
      ]
    }),
    onBeforeTimeHeaderRender: args => {
      if (args.header.start.getDayOfWeek() === 0) {
        args.header.cssClass = "suncss";
      }
      let fromatArray = args.header.html.split(',');
      args.header.html = fromatArray[0] + '<br>' + ("" + fromatArray[1]).substring(0, 3).toUpperCase();
    },
    onBeforeRowHeaderRender: args => {
      args.row.backColor = (args.row.index % 2) ? "#F1F1F1" : "#F9F9F9";
    },
    onBeforeResHeaderRender: args => {
      /*if (args.resource.level == 0){
        args.resource.cssClass = "levelParent";
      }*/
    },
    onBeforeCellRender: args => {
      //      
    },
    onBeforeEventRender: args => {
      //args.data.backColor = args.data.color;
    },
    onAfterRender: args => {
      this.blockedRoomCountCellWidth = $('.scheduler_default_matrix').outerWidth() / this.config.days;
      $(".scheduler_default_corner").append("<div class='inner_date'>Dates</div>");
      $(".room-blocked-head").css({
        width: $('.scheduler_default_corner_inner').outerWidth() + 'px'
      });
      this.config.height = this.schedulerHeight; // $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $(".frontdesk-header").outerHeight() + $(".room-blocked-row").outerHeight() + 40);
    },
    onTimeRangeSelected: args => {
      this.create.show(args);
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
    this.config.resources = [];
    //this.config.height = 650;

    let from = this.scheduler.control.visibleStart();
    let to = this.scheduler.control.visibleEnd();

    let requestOption = {
      startDate: moment(from['value']).format('YYYY-MM-DD'),
      endDate: moment(to['value']).format('YYYY-MM-DD')
    }

    this.fdData.getRoomRateDetails().subscribe(roomRateResponse => {
      
      console.log("in room rate details response: ", roomRateResponse);
      
      this.roomList = roomRateResponse[0];
      this.ratePlanList = roomRateResponse[1];

      for (let roomResIndex = 0; roomResIndex < this.roomList.length; roomResIndex++) {
        let childRoomList = [];
        for (let roomNumbIndex = 0; roomNumbIndex < this.roomList[roomResIndex].roomNumbers.length; roomNumbIndex++) {
          childRoomList.push({
            name: this.roomList[roomResIndex].roomNumbers[roomNumbIndex],
            id: this.roomList[roomResIndex].roomNumbers[roomNumbIndex]
          });
        }

        let topResource = {
          name: this.roomList[roomResIndex].roomName,
          id: this.roomList[roomResIndex].roomCode,
          resourceType: 'room',
          expanded: this.config.resources.length > 0 ? false : true,
          children: childRoomList
        };

        this.config.resources.push(topResource);
      }


    });


    this.getReservationDetailList(requestOption);

  }

  getReservationDetailList(requestOption) {

    //console.log("response-->: ", requestOption);

    this.fdData.getReservationDetails(requestOption).subscribe(res => {

      this.events = [];
      let eventList = res['reservations'].reservation;
      console.log("event list: ", eventList);

      for (let eventIndex = 0; eventIndex < eventList.length; eventIndex++) {
        this.events.push({
          id: eventList[eventIndex].bookingID,
          resource: eventList[eventIndex].assignedRoomNumber,
          start: eventList[eventIndex].arrivalDate,
          end: eventList[eventIndex].departureDate,
          text: eventList[eventIndex].guestDetails.guestDetails[0].namePrefix + ' ' + eventList[eventIndex].guestDetails.guestDetails[0].givenName + ' ' + eventList[eventIndex].guestDetails.guestDetails[0].surName,
          color: '#e69138',
          otherData: eventList[eventIndex]
        })
      }

    });
  }

  viewChange(args) {
    //console.log("in view change: ", args, this.scheduler.control.visibleStart(), this.scheduler.control.visibleEnd());

    // quit if the date range hasn't changed
    if (!args.visibleRangeChanged) {
      return;
    }

    let from = this.scheduler.control.visibleStart();
    let to = this.scheduler.control.visibleEnd();

  }

  setSchedularDateRange(type) {
    this.showBooking = false;
    if (type == '1') {
      this.dateTab = '1';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 1;
      this.showPicker = false;
    } else if (type == '3') {
      this.dateTab = '3';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 3;
      this.showPicker = false;
    } else if (type == '7') {
      this.dateTab = '7';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 7;
      this.showPicker = false;
    } else if (type == '15') {
      this.dateTab = '15';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 15;
      this.showPicker = false;
    } else if (type == 'month') {
      this.dateTab = 'month';
      this.config.startDate = moment().format("YYYY-MM-DD");
      this.config.days = moment().daysInMonth();
      this.showPicker = false;
    } else if ('custom') {
      this.showPicker = true;
    }

    this.countObservable = _.range(this.config.days);

    let requestOption = {
      startDate: this.config.startDate,
      endDate: moment().add(this.config.days, 'd').format('YYYY-MM-DD')
    }

    this.getReservationDetailList(requestOption);

  }

  createClosed(args) {
    if (args.result) {
      this.events.push(args.result);
      this.scheduler.control.message("Created.");
    }
    this.scheduler.control.clearSelection();
  }

  showBookingSection(eventData) {
    this.eventBookingData = eventData.source.data.otherData;

    setTimeout(() => {
      console.log("in showing booking data: ", eventData);
      this.showBooking = true;

    }, 0);
  }

}
