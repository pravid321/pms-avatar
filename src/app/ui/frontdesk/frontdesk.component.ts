import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {DayPilot, DayPilotSchedulerComponent} from 'daypilot-pro-angular';
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

  @ViewChild('scheduler')
    scheduler: DayPilotSchedulerComponent;
  
    config: any = {
      scale: "Day",
      startDate: DayPilot.Date.today().firstDayOfMonth(),
      days: DayPilot.Date.today().daysInMonth(),
      timeHeaders: [
        {groupBy: "Month"},
        {groupBy: "Day", format: "d"}
      ],
      resources: [
        {id:"group_1", name: "Rooms", expanded: true, children: [
          {id: 1, name: "Person 1"},
          {id: 2, name: "Person 2"},
          {id: 3, name: "Person 3"}
        ]},
        {id: "group_2", name: "Rates", expanded: true, children: [
          {id: 4, name: "Tool 1"},
          {id: 5, name: "Tool 2"},
          {id: 6, name: "Tool 3"}
        ]}
      ]
    };

}
