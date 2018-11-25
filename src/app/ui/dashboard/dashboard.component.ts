import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private routeParamService: RouteParameterService) { }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'Dashboard'
    });
  }

}
