import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { DataEventService } from '../../../shared/data.event.service';

@Component({
  selector: 'app-ui-frontdesk-left-sidebar-panel',
  templateUrl: './frontdesk.left.sidebar.panel.component.html'
})
export class FrontdeskLeftSidebarComponent implements OnInit {

  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  constructor(private _des: DataEventService) { }

   ngOnInit() {
    let buffer = 10;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#uiFooter").outerHeight() + buffer);
  }

  closeSideSidebar() {
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }

  showFrontDeskPage(pageType: any) {
    this._des.newEvent(pageType);
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }

}