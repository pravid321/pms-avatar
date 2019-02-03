import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { UserResolver } from '../../shared/user.resolver.service';
import { DataEventService } from '../../shared/data.event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {

  now: number;
  subHeaderPaddingLeft: number;
  userData: any;

  @Input()
  paramDetails: any;

  constructor(private _userResolver: UserResolver, private _auth: AuthService, private _des: DataEventService) {
    //this.userData 
    this.now = Date.now();
    setInterval(() => {
      this.now = Date.now();
    }, 10000);
  }

  ngOnInit() { 
    this.userData = this._userResolver.getUserData();
  }

  ngAfterViewInit(): void {

    $('#sidebarCollapse').on('click', function (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      if ($('#sidebar').hasClass('active')) {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
      } else {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      }
    });

    $('#dismiss, .overlay, .side-link').on('click', function () {
      $('#sidebar').removeClass('active');
      $('.overlay').removeClass('active');
    });

    setTimeout(() => {
      let excessWidth = $("#sub-navbar").outerWidth() - $("#sub-menu1").outerWidth();
      this.subHeaderPaddingLeft = (excessWidth / 2) - $(".nav-item").outerWidth();
    }, 0);

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("in home component change: ", this.paramDetails);
    
    setTimeout(() => {
      let excessWidth = $("#sub-navbar").outerWidth() - $("#sub-menu1").outerWidth();
      this.subHeaderPaddingLeft = (excessWidth / 2) - $(".nav-item").outerWidth();
    }, 0);
  }

  closeSideSidebar(){
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }

  showFrontDeskPage(pageType: any) {
    this._des.newEvent(pageType);
    $('#sidebar').removeClass('active');
    $('.overlay').removeClass('active');
  }

  logout() {
    this._auth.removeLoginCredentialsInCookie();
    setTimeout(() => {
      this._auth.removeToken();      
    }, 100);
  }

}
