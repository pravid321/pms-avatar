import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { formatDate } from '@angular/common';

import { BookingOperationsService } from '../../services/booking.operations.service';
import { ICheckOutCardData } from '../CheckInOutCard';
import { UserResolver } from '../../../shared/user.resolver.service';

@Component({
  selector: 'app-ui-frontdesk-checkout-card',
  templateUrl: './checkout.card.component.html'
})
export class CheckOutCardComponent implements OnInit {

  @Input() bookingData: any;
  @Output() closeCheckOut = new EventEmitter();
  curDate = formatDate(new Date(), 'MMMM dd, yyyy', 'en');
  checkOutCardData: ICheckOutCardData; 
  loggedUserData: any;

  constructor(private _bookingOperationsService: BookingOperationsService, private _userResolver: UserResolver) {
    this.loggedUserData = this._userResolver.getUserData();
    //console.log("in check out card component constructor: ", this._userResolver.getHotelID(), this._userResolver.getUserData());
  }

  ngOnInit() {
    this.checkOutCardData = {
      hotelDetails: null,
      resData: null,
      billDetails: null,
      dayWiseTransaction: null

    };
    this._bookingOperationsService.getCheckOutCardDetails(this.bookingData.bookingID).subscribe((bkOperationRes:ICheckOutCardData) => {
      this.checkOutCardData = bkOperationRes;
      //console.log("in check out card component: ", this.bookingData, this.checkOutCardData);
    });    
  }

  closeCheckOutModal(type: string) {
    this.closeCheckOut.emit(type);
  }
}