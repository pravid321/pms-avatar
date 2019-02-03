import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin.layout.component.html'
})
export class AdminLayoutComponent {

    paramDetails: any;
  
    constructor() {
      this.paramDetails = {
        url: '',
        pageName: ''
      };
      
      $('body').css({
        'background-color': '#FFF'
      });
    }

}