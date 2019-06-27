import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PaymentService } from '../services/payment.services';
import { RouteParameterService } from '../../shared/route.parameter.service';
import { UserResolver } from '../../shared/user.resolver.service';

import moment from 'moment';

@Component({
  selector: 'payment-details',
  templateUrl: './payments.component.html'
})
export class PaymentsComponent implements OnInit {

  @Input() bookingData: any;
  public userData: any;
  public transactionData: any;
  public totalBillData: any;
  public paymentRequest: any;
  public alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private routeParamService: RouteParameterService,
    private _userResolver: UserResolver
  ) { }

  ngOnInit() {
    console.log("in payment: ", this.bookingData);

    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: this.router.url == '/ui/frontdesk' ? 'Frontdesk' : 'billings'
    });

    this.userData = this._userResolver.getUserData;

    this.getPaymentDetails(this.bookingData.bookingID, this.bookingData.assignedRoomNumber);
  }

  public getPaymentDetails(bookingId: number, roomNo: number) {
    this.paymentRequest = {
      "paymentType": "1",
      "paymentDesc": "",
      "paymentDate": "",
      "paymentMode": "1",
      "ccNo": "",
      "paymentAmount": null,
      "cashierName": "",
      "receiptNo": "",
      "folioId": "",
      "roomId": ""
    }
    this.paymentService.getBillingsDetails(bookingId, roomNo).subscribe(res => {
      console.log("on payment response: ", res);
      this.transactionData = res['transactions'];
      this.totalBillData = res['totalBill'];

      this.paymentRequest["paymentDate"] = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
      this.paymentRequest["cashierName"] = this.userData.userName;
      this.paymentRequest["folioId"] = this.transactionData[0].folioId;
      this.paymentRequest["roomId"] = this.transactionData[0].roomId;

    })
  }


  public updatePayment() {
    //console.log("in payment service: ", this.paymentRequest);
    this.paymentService.makeBillPayment(this.paymentRequest).subscribe(res => {
      //console.log("after payment response: ", res);
      this.alertMessageDetails.response = true;
      if (res['successList'][0]['status'].toLowerCase() == 'success') {
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = res['successList'][0]['message'];
        this.getPaymentDetails(this.bookingData.bookingID, this.bookingData.assignedRoomNumber);
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Payment data not updated! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    });
  }

}
