import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'app-ui-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private router : Router, private routeParamService: RouteParameterService) { }

  ngOnInit() {
    this.routeParamService.setParam({
      url: this.router.url,
      pageName: 'Reports'
    });
  }

}
