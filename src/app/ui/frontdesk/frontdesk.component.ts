import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'app-ui-frontdesk',
  templateUrl: './frontdesk.component.html',
  styleUrls: ['./frontdesk.component.scss']
})
export class FrontdeskComponent implements OnInit {

  constructor(private router: Router, private routeParamService: RouteParameterService) { }

  ngOnInit() {
    this.routeParamService.setParam({
      url: this.router.url,
      pageName: 'Frontdesk'
    });
  }

}
