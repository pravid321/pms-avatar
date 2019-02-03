import { AfterViewInit, Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import moment from 'moment';

import { FrontDeskService } from '../../services/front.desk.services';

@Component({
  selector: 'app-ui-frontdesk-report-details',
  templateUrl: './report.details.component.html',
  styleUrls: ['./report.details.component.scss']
})
export class ReportDetailsComponent implements OnInit, OnChanges {

  @Input() bsRangeValue:Date[];
  @Input() requestType: String;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  public config: PerfectScrollbarConfigInterface = {};
  scrollBarContainerHeight:number = 0;

  selectedRoomItem: any;
  noOfNights: number;
  reservationList: any = null;

  constructor(private fdServ: FrontDeskService){}

  ngOnInit() {
    /*console.log("in report details :", this.bsRangeValue,
    moment(this.bsRangeValue[0]).format("YYYY-MM-DD"),
    moment(this.bsRangeValue[1]).format("YYYY-MM-DD")
    );   */

    let buffer = 50;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $(".frontdesk-header").outerHeight() + $("#pageFooter").outerHeight() + $("#uiFooter").outerHeight() + buffer);
    
    /*this.fdServ.getReservationStatus({
      start_date: moment(this.bsRangeValue[0]).format("YYYY-MM-DD"),
      end_date: moment(this.bsRangeValue[1]).format("YYYY-MM-DD"),
      reqtype: this.requestType
    }).subscribe( revStatusDetails => {
      console.log("in rev response: ", revStatusDetails);
      this.reservationList = revStatusDetails['reservation'];
    })*/
  }

  ngOnChanges(){
    console.log("report on change fired: ");
    this.reservationList = null;
    this.fdServ.getReservationStatus({
      start_date: moment(this.bsRangeValue[0]).format("YYYY-MM-DD"),
      end_date: moment(this.bsRangeValue[1]).format("YYYY-MM-DD"),
      reqtype: this.requestType
    }).subscribe( revStatusDetails => {
      console.log("in rev response: ", revStatusDetails);
      switch(this.requestType){
        case 'CheckedIn':
        this.reservationList = revStatusDetails['arrival'];
          break;
        case 'CheckedOut':
          this.reservationList = revStatusDetails['departure'];
          break;
        case 'inhouse':
          this.reservationList = revStatusDetails['inHouse'];
          break;
        case 'Bookings':
          this.reservationList = revStatusDetails['reservation'];
          break;
        case 'NoShow':
          this.reservationList = revStatusDetails['reservation'];
          break;
        case 'Cancellations':
          this.reservationList = revStatusDetails['reservation'];
          break;
      }
      
    })
  }

}