import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';

import { OpenCloseCashCounterService } from '../../services/open.close.cash.counter.service';
import { UserResolver } from '../../../shared/user.resolver.service';

import moment from 'moment';

@Component({
  templateUrl: './close.cash.counter.component.html'
})
export class CloseCashCounterComponent implements OnInit {
  closeCounterList: any;
  loggedUserData: any;
  openingCashAmt: number;
  disrepancyReason: string;
  curDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  totalSalesDetails = {
    "openingbalance": 0,
    "collection": 0,
    "widrawals": 0,
    "closingAmount": 0,
    "descripency": 0,
    "balanceInHand": 0
  };
  selectedCounter: any = {
    "counterId": "",
    "counterName": "Select Counter"
  };

  counterData
  counterList = [
    {
      "counterId": 1,
      "counterName": "DayCounter",
      "counterType": "Cash"
    },
    {
      "counterId": 2,
      "counterName": "NightCounter",
      "counterType": "Cash"

    }
  ];

  constructor(
    private openCloseCashCounterService: OpenCloseCashCounterService,
    private userResolver: UserResolver,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loggedUserData = this.userResolver.getUserData();
    this.closeCounterList = null;
    this.activatedRoute.data.subscribe(data => {
      this.counterList = data['counterData']['counters'];
    });
  }

  showCounterList() {
    let transSummaryReqObj = {
      'TransactionDate': moment().format("YYYY-MM-DD"),
      "CounterId": this.selectedCounter.counterId
    };
    this.openCloseCashCounterService.getTransactionSummary(transSummaryReqObj).subscribe(res => {
      this.closeCounterList = res['transactionSumarry'];
      this.closeCounterList.map(summaryItem => {
        this.totalSalesDetails.openingbalance += summaryItem['openingbalance'],
        this.totalSalesDetails.collection += summaryItem['collection'],
        this.totalSalesDetails.widrawals += summaryItem['widrawals'],
        this.totalSalesDetails.closingAmount += summaryItem['closingAmount'],
        this.totalSalesDetails.descripency += summaryItem['descripency'],
        this.totalSalesDetails.balanceInHand += summaryItem['balanceInHand']
      })
      console.log("after transaction summary response: ", this.closeCounterList);
    })
  }

  closeCounter() {
    let closeCashCounterReq = {
      "counterId": "1",
      "counterType": "Cash",
      "businessDate": formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      "openingBalance": this.openingCashAmt,
      "closingBalance": 0.0, // cash closing amount
      "differences": 0.00,
      "cashierId": this.loggedUserData.userName
    };
    if (this.openingCashAmt >= 0) {
      this.openCloseCashCounterService.closeCashCounter(closeCashCounterReq).subscribe((closeCashCounterRes: any) => {
        console.log("close cash counter response: ", closeCashCounterRes);
      })
    }
  }

}