import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';

import { OpenCloseCashCounterService } from '../../services/open.close.cash.counter.service';
import { UserResolver } from '../../../shared/user.resolver.service';

@Component({
  templateUrl: './open.cash.counter.component.html'
})
export class OpenCashCounterComponent implements OnInit {
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };  
  curDate = formatDate(new Date(), 'MMMM dd, yyyy', 'en');
  loggedUserData: any;
  isOpenCounter: boolean ;
  openingCashAmt: number;
  selectedCounter: any = {
    "counterId": "",
    "counterName": "Select Counter"
  };
  counterList: any;
  // counterList = [
  //   {
  //     "counterId": 1,
  //     "counterName": "DayCounter",
  //     "counterType": "Cash"
  //   },
  //   {
  //     "counterId": 2,
  //     "counterName": "NightCounter",
  //     "counterType": "Cash"

  //   }
  // ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private openCloseCashCounterService: OpenCloseCashCounterService,
    private userResolver: UserResolver
  ) { }

  ngOnInit() {
    this.loggedUserData = this.userResolver.getUserData();
    this.isOpenCounter = true;
    this.activatedRoute.data.subscribe(data => {
      this.counterList = data['counterData']['counters'];
    });
  }

  openCounter() {
    let openCashCounterReq = {
      "counterId": this.isOpenCounter ? this.selectedCounter.counterId : '',
      "counterType": "Cash",
      "businessDate": formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      "OpenCounter": + this.isOpenCounter,
      "openingBalance": this.isOpenCounter ? this.openingCashAmt : '',
      "closingBalance": 0.00,
      "differences": 0.00,
      "cashierId": this.loggedUserData.userName
    };

    //console.log("in continue click: ", openCashCounterReq);
    
    this.openCloseCashCounterService.openCashCounter(openCashCounterReq).subscribe((openCashCounterRes: any) => {
      console.log("open cash counter response: ", openCashCounterRes);
      this.alertMessageDetails.response = true;

      if (openCashCounterRes['successList'][0]['status'].toLowerCase() == 'success') {
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = openCashCounterRes['successList'][0]['message'];
      }else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = openCashCounterRes['successList'][0]['message'] + " Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    })
    
  }
}