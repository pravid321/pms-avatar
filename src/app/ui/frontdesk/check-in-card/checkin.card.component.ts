import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { formatDate } from '@angular/common';

import { BookingOperationsService } from '../../services/booking.operations.service';
import { ICheckInCardData } from '../CheckInOutCard';
import { UserResolver } from '../../../shared/user.resolver.service';

@Component({
  selector: 'app-ui-frontdesk-checkin-card',
  templateUrl: './checkin.card.component.html'
})
export class CheckInCardComponent implements OnInit {

  @Input() bookingData: any;
  @Output() closeCheckIn = new EventEmitter();
  checkinCardData: ICheckInCardData;
  curDate = formatDate(new Date(), 'MMMM dd, yyyy', 'en');
  loggedUserData: any;

  constructor(
    private _bookingOperationsService: BookingOperationsService,
    private _userResolver: UserResolver
  ) {
    this.loggedUserData = this._userResolver.getUserData();
  }

  ngOnInit() {
    this.checkinCardData = {
      hotelDetails: null,
      resData: null,
      totalbill: null
    }
    this._bookingOperationsService.getCheckInCardDetails(this.bookingData.bookingID).subscribe((bkOperationRes: ICheckInCardData) => {
      this.checkinCardData = bkOperationRes;
      //console.log("in ng card component: ", this.bookingData, this.checkinCardData);
    })
  }

  closeCheckInModal(type: string) {
    this.closeCheckIn.emit(type);
  }
}