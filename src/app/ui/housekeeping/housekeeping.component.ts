import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'app-ui-housekeeping',
  templateUrl: './housekeeping.component.html',
  styleUrls: ['./housekeeping.component.scss']
})
export class HousekeepingComponent implements OnInit {

  constructor(private router: Router, private routeParamService: RouteParameterService) { }

  ngOnInit() {
    this.routeParamService.setParam({
      url: this.router.url,
      pageName: 'Housekeeping'
    });
  }

}
