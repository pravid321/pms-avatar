import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'app-ui-restaurant',
  templateUrl: './restaurant.component.html'
})
export class RestaurantComponent implements OnInit {

  constructor(private router: Router, private routeParamService: RouteParameterService) { }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'Restaurant'
    });
  }

}
