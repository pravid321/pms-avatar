import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  templateUrl: './billings.component.html',
  styleUrls: ['./billings.component.scss']
})
export class BillingsComponent implements OnInit {

  constructor(private router: Router, private routeParamService: RouteParameterService) { }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'billings'
    });
  }

}
