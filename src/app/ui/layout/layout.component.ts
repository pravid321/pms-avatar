import { Component, OnInit, HostListener } from '@angular/core';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  
  paramDetails = {
    url: '',
    pageName: '' 
  };

  constructor(private routeParamService: RouteParameterService) { }

  ngOnInit() { 
    this.paramDetails = this.routeParamService.getParam();
  }

  @HostListener('click') openDropdown(eventData: Event) {    
      this.paramDetails = this.routeParamService.getParam();
  }

}
