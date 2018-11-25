import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
    selector: 'app-ui-frontdesk-booking-details',
    templateUrl: './booking.details.component.html',
    styleUrls: ['./booking.details.component.scss']
  })
  export class BookingDetailsComponent implements AfterViewInit {

    @Input() bookingData: any;

    ngAfterViewInit() {        
        console.log("primaryColorSample:", JSON.stringify(this.bookingData));
      }  
  }