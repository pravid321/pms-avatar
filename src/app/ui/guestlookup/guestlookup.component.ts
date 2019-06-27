import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';

import { GuestLookupService } from '../services/guestlookup.service';
import { RouteParameterService } from '../../shared/route.parameter.service';
import { IGuest } from './GuestLookup';

@Component({
  selector: 'app-ui-guest-lookup',
  templateUrl: './guestlookup.component.html'
})
export class GuestLookupComponent implements OnInit {

  scrollBarContainerHeight: number;

  public guestLookupObject: any;
  public guestList: IGuest[];

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(private router: Router, private routeParamService: RouteParameterService, private guestLookupService: GuestLookupService) { }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'guestlookup'
    });

    this.guestLookupObject = {
      "givenName": "",
      "surName": "",
      "phoneNumber": "",
      "email": "",
      "bookingSource": ""
    };

    //this.guestSearch();

  }

  guestSearch() {
    this.guestLookupService.getGuestLookupList(this.guestLookupObject).subscribe(res => {
      console.log("res: ", this.guestLookupObject, res);
      this.guestList = res['LookUpDetails'];
    })

    let headerBuffer = 450;
    this.scrollBarContainerHeight = $(document).height() - headerBuffer;
  }

  clearSearch() {
    this.guestList = [];
    this.guestLookupObject = {
      "givenName": "",
      "surName": "",
      "phoneNumber": "",
      "email": "",
      "bookingSource": ""
    };
  }

  generatePopoverContent(index, item){
    console.log("index and item: ", index, item);
  }

  showPaymentDetails(pageType: string) {

    //this.billingPageView = pageType;    
  }

}
