import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, ViewChild, ModuleWithComponentFactories } from '@angular/core';
import { DayPilot, DayPilotSchedulerComponent } from 'daypilot-pro-angular';
import { OwlCarousel } from 'ngx-owl-carousel';
import { Router } from '@angular/router';
//import { DaterangePickerComponent } from 'ng2-daterangepicker';

import moment from 'moment';
import * as $ from 'jquery';
import _ from 'lodash';

import { BookingDetailsComponent } from './booking-details/booking.details.component';
import { DataEventService } from '../../shared/data.event.service';
import { DataService, CreateEventParams, MoveEventParams } from '../scheduler/data.service';
import { FrontDeskService } from '../services/front.desk.services';
import { IRoom, IRatePlan, IReservationData } from './Frontdesk';
import { QuickReservationComponent } from './quick-reservation/quick.reservation.component';
import { RouteParameterService } from '../../shared/route.parameter.service';
import { ReportDetailsComponent } from './report-details/report.details.component';


export const frontDeskChildComponents = [BookingDetailsComponent, QuickReservationComponent, ReportDetailsComponent];

@Component({
  selector: 'app-ui-frontdesk',
  templateUrl: './frontdesk.component.html',
  styleUrls: ['./frontdesk.component.scss']
})
export class FrontdeskComponent implements OnInit {

  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  selectedStartDate: Date;
  selectedEndDate: Date;
  bsRangeValue: Date[];

  roomList: IRoom[];
  ratePlanList: IRatePlan[];

  showPicker: boolean = false;
  dateTab: string = 'custom';
  countObservable: any;
  blockedRoomCountCellWidth: number;
  schedulerHeight: number;

  eventBookingData: any;

  public daterange: any = {};
  public fdPageView: string = 'console';

  reservationStatusReportType: string;
  detailReservationList: any = [];


  @ViewChild('owlElement') owlElement: OwlCarousel;

  @ViewChild('scheduler') scheduler: DayPilotSchedulerComponent;
  @ViewChild("create") create: QuickReservationComponent;

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  public buttonCarouselOptions = {
    //loop: true,
    dots: false,
    //center: true,
    autoWidth: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        margin: 0
      },
      375: {
        items: 2,
        margin: 2
      },
      550: {
        items: 3,
        margin: 5
      },
      1000: {
        items: 4,
        margin: 10
      }
    }
  };

  constructor(
    private router: Router,
    private routeParamService: RouteParameterService,
    private ds: DataService,
    private dateData: DataEventService,
    private fdData: FrontDeskService
  ) {
    //this.minDate = new Date();
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-blue',
      rangeInputFormat: 'DD-MMM-YYYY',
      //minDate: new Date(),
      showWeekNumbers: false
    });
    this.selectedStartDate = new Date();
    this.selectedEndDate = new Date();
    this.selectedEndDate.setDate(this.selectedStartDate.getDate() + 13);
    this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
  }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'Frontdesk'
    });

    this.config.days = moment(this.selectedEndDate).diff(moment(this.selectedStartDate), 'days') + 1;
    this.showPicker = false;
    this.blockedRoomCountCellWidth = ($('.scheduler_default_scrollable').outerWidth() / this.config.days);
    this.dateTab = 'custom';
    this.countObservable = _.range(this.config.days);
    this.config.startDate = moment(this.selectedStartDate).format('YYYY-MM-DD');

    $(".room-blocked-head").css({
      width: $('.scheduler_default_corner_inner').outerWidth() + 'px'
    });

    let requestOption = {
      startDate: moment(this.selectedStartDate).format('YYYY-MM-DD'),
      endDate: moment(this.selectedEndDate).format('YYYY-MM-DD')
    };

    //console.log("in in it: ", requestOption);

    this.dateData.currentEvent.subscribe(eventData => {
      //console.log("in frontdesk: ", eventData);
      switch (eventData) {
        case 'CheckedIn':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'CheckedOut':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'inhouse':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'Bookings':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'NoShow':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
        case 'Cancellations':
          this.fdPageView = 'reservationReports';
          this.reservationStatusReportType = eventData;
          break;
      }
    });

    this.schedulerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $(".frontdesk-header").outerHeight() + $(".fixed-bottom").outerHeight() + 78);
  }

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
    //contextMenu: ,
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
      //console.log("on before render event argument: ", args);
      let contextMenu = new DayPilot.Menu({
        items: [
          {
            text: "Cancel Check In",
            image: "./assets/images/guest-lookup-ico.png",
            disabled: true,
          },
          {
            text: "Check In",
            image: "./assets/images/guest-lookup-ico.png",
            onClick: eventArgs => {
              this.changeBookingStatus(args['data'].otherData, 'Checkin');
            }
          },
          {
            text: "Check Out",
            image: "./assets/images/guest-lookup-ico.png",
            disabled: true,
            onClick: eventArgs => {
              this.changeBookingStatus(args['data'].otherData, 'Checkout');
            }
          },
          {
            text: "Cancel Check Out",
            image: "./assets/images/guest-lookup-ico.png",
            disabled: true,
          },
          {
            text: "Assign",
            image: "./assets/images/guest-lookup-ico.png",
            disabled: true,
          },
          {
            text: "Un Assign",
            image: "./assets/images/guest-lookup-ico.png",
            disabled: true,
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
              let existsBooking = this.detailReservationList.find(bookingData => bookingData.bookingID == args.source.data.otherData.bookingID);
              //console.log("on args click: ", args, existsBooking);
              if (typeof existsBooking === 'undefined') {
                this.detailReservationList.push({
                  'bookingID': args.source.data.otherData.bookingID,
                  'givenName': args.source.data.otherData.guestDetails.guestDetail[0].givenName + ' ' + args.source.data.otherData.guestDetails.guestDetail[0].surName,
                  'otherData': args.source.data.otherData
                });
                this.showBookingSection(args.source.data.otherData, true);
              } else {
                this.showBookingSection(args.source.data.otherData, false);
              }
            }
          },
          {
            text: "Group Check In",
            image: "./assets/images/guest-lookup-ico.png",
            disabled: true,
          },
          {
            text: "Group Check Out",
            image: "./assets/images/guest-lookup-ico.png",
            disabled: true,
          },
          {
            text: "Messages/Task",
            image: "./assets/images/guest-lookup-ico.png",
          }
        ]
      });

      args.e.contextMenu = contextMenu;
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
      let roomDetail = this.getSelectedRoomDetails(args.resource);
      args['roomCode'] = roomDetail.roomCode;
      args['roomName'] = roomDetail.roomName;
      args['roomDesc'] = roomDetail.roomDesc;
      this.create.show(args);
    },
    onEventResized: args => {
      console.log("at event resized: ", args);
    },
    onEventMove: args => {
      /*let params: MoveEventParams = {
        id: args.e.id(),
        start: args.newStart.toString(),
        end: args.newEnd.toString(),
        resource: args.newResource
      };
      console.log("on move: ", params);*/

      let moveEventOption = {
        "bookingID": args.e.id(),
        "roomNumber": args.newResource,
        "action": "Assign"
      }
      this.fdData.assignOrCheckinReservation(moveEventOption).subscribe(result => {
        this.scheduler.control.message(result['message']);
        let revEvent = this.events.find(revData => revData.id == moveEventOption.bookingID);
        revEvent.resource = moveEventOption.roomNumber;
        revEvent.otherData.assignedRoomNumber = moveEventOption.roomNumber;
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

  getReservationDetailList(requestOption: any) {
    let eventColorList = {
      'CheckedIn': {
        'backColor': '#f286ea',
        'borderColor': '#c855bf',
        'fontColor': '#fff'
      },
      'New': {
        'backColor': '#ffa5a7',
        'borderColor': '#f75b5f',
        'fontColor': '#fff'
      },
      'Modify': {
        'backColor': '#97ed6d',
        'borderColor': '#5cb431',
        'fontColor': '#fff'
      },
      'CheckedOut': {
        'backColor': '#7ebae0',
        'borderColor': '#5c99bf',
        'fontColor': '#fff'
      }
    }
    //console.log("response-->: ", requestOption);

    this.fdData.getReservationDetails(requestOption).subscribe(res => {

      this.events = [];
      let eventList = res['reservations'].reservation;
      // ...res['deprts'].departure
      //console.log("event list: ", eventList);


      for (let eventIndex = 0; eventIndex < eventList.length; eventIndex++) {
        //console.log('in loop: ', eventColorList[eventList[eventIndex].bookingStatus]);
        this.events.push({
          id: eventList[eventIndex].bookingID,
          resource: eventList[eventIndex].assignedRoomNumber,
          start: eventList[eventIndex].arrivalDate,
          end: eventList[eventIndex].departureDate,
          text: eventList[eventIndex].guestDetails.guestDetail[0].namePrefix + ' ' + eventList[eventIndex].guestDetails.guestDetail[0].givenName + ' ' + eventList[eventIndex].guestDetails.guestDetail[0].surName,
          backColor: eventColorList[eventList[eventIndex].bookingStatus].backColor,
          borderColor: eventColorList[eventList[eventIndex].bookingStatus].borderColor,
          fontColor: eventColorList[eventList[eventIndex].bookingStatus].fontColor,
          otherData: eventList[eventIndex]
        })
      }

    });
  }

  /*   This method wil call on schedular date with view change   */
  viewChange(args: any) {
    //console.log("in view change: ", args, this.scheduler.control.visibleStart(), this.scheduler.control.visibleEnd());

    // quit if the date range hasn't changed
    if (!args.visibleRangeChanged) {
      return;
    }

    let from = this.scheduler.control.visibleStart();
    let to = this.scheduler.control.visibleEnd();

  }

  /*   This method wil call on date range calender setting   */
  onCalenderValueChange() {
    console.log("dt change: ", this.bsRangeValue);
    this.selectedStartDate = this.bsRangeValue[0];
    this.selectedEndDate = this.bsRangeValue[1];

    // schedular config needs to be set allways irrespective of tabs 
    // date change in other tab and return to console it should load data according to date selection
    this.config.startDate = moment(this.selectedStartDate).format('YYYY-MM-DD');
    this.config.days = moment(this.selectedEndDate).diff(moment(this.selectedStartDate), 'days') + 1;

    if (this.fdPageView == 'console') {
      this.blockedRoomCountCellWidth = ($('.scheduler_default_scrollable').outerWidth() / this.config.days);
      this.dateTab = 'custom';
      this.countObservable = _.range(this.config.days);
      let requestOption = {
        startDate: moment(this.selectedStartDate).format('YYYY-MM-DD'),
        endDate: moment(this.selectedEndDate).format('YYYY-MM-DD')
      }
      this.getReservationDetailList(requestOption);
    }

  }

  datePickerRangeSet(dt){
    console.log("on datepicker change: ", dt);
    console.log("dt change: ", this.bsRangeValue);
  }

  /* ***** This method will change the booking status ******* */
  public changeBookingStatus(eventArgs: any, expectedStatus: string) {
    console.log("in change booking status: ", eventArgs, expectedStatus);
    let eventCheckinOption = {
      "bookingID": eventArgs.bookingID
    }
    if (expectedStatus == 'Checkin') {
      eventCheckinOption["roomNumber"] = eventArgs.assignedRoomNumber;
      eventCheckinOption["action"] = 'Checkin';

      this.fdData.assignOrCheckinReservation(eventCheckinOption).subscribe(result => {
        this.scheduler.control.message(result['message']);
      });
    } else if (expectedStatus == 'Checkout') {
      this.fdData.checkOutReservation(eventCheckinOption).subscribe(result => {
        this.scheduler.control.message(result['message']);
      });
    }
  }


  /*   This method will call on console tab change or from other tab to land on console screen */
  public setSchedularDateRange(type: any) {
    this.fdPageView = 'console';
    if (type == '1') {
      this.dateTab = '1';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 1;
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == '3') {
      this.dateTab = '3';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 3;
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().add('2', 'days').toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == '7') {
      this.dateTab = '7';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 7;
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().add('6', 'days').toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == '15') {
      this.dateTab = '15';
      this.config.startDate = moment().format('YYYY-MM-DD');
      this.config.days = 15;
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().add('14', 'days').toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == 'month') {
      this.dateTab = 'month';
      this.config.startDate = moment().format("YYYY-MM-DD");
      this.config.days = moment().daysInMonth();
      this.showPicker = false;
      this.selectedStartDate = moment().toDate();
      this.selectedEndDate = moment().add((this.config.days - 1), 'days').toDate();
      this.bsRangeValue = [this.selectedStartDate, this.selectedEndDate];
    } else if (type == 'custom') {
      this.showPicker = true;
    } else {
      this.showPicker = false;
    }

    this.countObservable = _.range(this.config.days);

    let requestOption = {
      startDate: this.config.startDate,
      endDate: moment().add(this.config.days, 'd').format('YYYY-MM-DD')
    }

    this.getReservationDetailList(requestOption);

  }

  /*   This method will call on date select for quick reservation to get selected room details   */
  getSelectedRoomDetails(roomNo: any) {
    let selectedRoomObj: any;
    this.roomList.map(roomObj => {
      if (typeof roomObj.roomNumbers.find(roomListNo => roomListNo == roomNo) !== 'undefined') {
        selectedRoomObj = roomObj;
      }
    });
    return selectedRoomObj;
  }

  createClosed(eventData: any) {
    if (eventData) {
      this.events.push(eventData);
      this.scheduler.control.message("Reservation created successfully.");
    }
    this.scheduler.control.clearSelection();
  }

  showBookingSection(eventDataDetails: any, dateModification: boolean) {

    this.eventBookingData = eventDataDetails;
    if (dateModification) {
      this.eventBookingData.arrivalDate = moment(this.eventBookingData.arrivalDate, 'YYYY-MM-DD HH:mm:ss.S').format('DD-MMM-YYYY');
      this.eventBookingData.departureDate = moment(this.eventBookingData.departureDate, 'YYYY-MM-DD HH:mm:ss.S').format('DD-MMM-YYYY');
      this.owlElement.reInit();
    }

    setTimeout(() => {
      this.fdPageView = 'bookingDetails';
    }, 0);
  }

  carouselPrev() {
    this.owlElement.previous([200]);
  }

  carouselNext() {
    this.owlElement.next([200]);
  }


}
