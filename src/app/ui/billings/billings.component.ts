import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'billing-details',
  templateUrl: './billings.component.html'
})
export class BillingsComponent implements OnInit {

  public billingPageView: string = 'list';

  constructor(private router: Router, private routeParamService: RouteParameterService) { }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'billings'
    });
  }

  showPaymentDetails(pageType: string) {

    this.billingPageView = pageType;    
  }

}
