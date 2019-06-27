import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DayPilot, DayPilotModalComponent } from "daypilot-pro-angular";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { FrontDeskService } from '../../services/front.desk.services';
import { IRatePlan, IReservationData } from '../../frontdesk/Frontdesk';
import { PaymentService } from '../../services/payment.services';
import { PriceManagerService } from '../../services/price.manager.service';
import { UserResolver } from '../../../shared/user.resolver.service';

import moment from 'moment';
import _ from 'underscore';

@Component({
  selector: 'create-dialog',
  templateUrl: './quick.reservation.component.html'
})
export class QuickReservationComponent {

  @ViewChild("modal") modal: DayPilotModalComponent;
  @Output() close = new EventEmitter();

  @Input() ratePlanList: any;

  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;
  minDate = new Date();
  form: FormGroup;
  isPaymentPanelVisible: boolean = false;
  selectedRoomName: string;
  resources: any[];
  selectedRoomId: number;
  selectedRoomUnitId: number;
  reservationPrice: number;
  public userData: any;
  private submitRatedata: any;

  constructor(
    private fb: FormBuilder,
    private fdServ: FrontDeskService,
    private paymentService: PaymentService,
    private priceManagerService: PriceManagerService,
    private _userResolver: UserResolver,
  ) {
    this.form = this.fb.group({
      adultCount: [""],
      childCount: [""],
      roomCount: [""],
      guestTitle: [""],
      guestFname: [""],
      guestLname: [""],
      guestPhone: [""],
      guestEmail: [""],
      rateType: [""],
      roomType: [""],
      roomDesc: [""],
      start: [""],
      end: [""],
      resource: ["", Validators.required],
      depositAmt: [""],
      duePayment: [""],
      cardHolderName: [""],
      cardCode: [""],
      cardNumber: [""],
      expireDate: [""],
      seriesCode: [""]
    });

    this.userData = this._userResolver.getUserData;

    this.bsConfigStart = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      minDate: new Date(),
      showWeekNumbers: false
    });

    this.bsConfigEnd = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      minDate: new Date(),
      showWeekNumbers: false
    });
  }

  show(args: any) {
    //console.log("on show: ", args );
    this.form.setValue({
      start: moment(args.start.toString('dd-MMM-yyyy'), 'DD-MMM-YYYY').format("DD-MMM-YYYY"),
      end: moment(args.end.toString('dd-MMM-yyyy'), 'DD-MMM-YYYY').subtract(1, 'd').format("DD-MMM-YYYY"),
      rateType: "slcRate",
      adultCount: "1",
      childCount: "0",
      roomCount: "1",
      guestTitle: "Mr.",
      guestFname: "",
      guestLname: "",
      guestPhone: "",
      guestEmail: "",
      resource: args.resource,
      roomType: args.roomCode,
      roomDesc: args.roomDesc,
      depositAmt: "",
      duePayment: "",
      cardHolderName: "",
      cardCode: "",
      cardNumber: "",
      expireDate: "",
      seriesCode: ""
    });
    this.selectedRoomName = args.roomName;
    this.selectedRoomId = args.roomID;
    this.selectedRoomUnitId = args.ruid;
    this.reservationPrice = 0;
    this.modal.show();
  }

  // to get rate plan nightly rate
  onItemChange() {
    let self = this;
    //console.log("rate plan change list: ", this.ratePlanList, self.form.controls['rateType'], 'yy');
    let requestPriceObj = {
      roomID: this.selectedRoomId, // here room id we need to send
      rateplanID: _.findWhere(this.ratePlanList, {rateCode: self.form.controls['rateType'].value})['ratePlanId'],
      checkinDate: moment(this.form.controls['start'].value, "DD-MMM-YYYY").format("YYYY-MM-DD"),
      checkoutDate: moment(this.form.controls['end'].value, "DD-MMM-YYYY").format("YYYY-MM-DD")
    };

    this.priceManagerService.getRatePrice(requestPriceObj).subscribe(res => {
      //console.log("on rate change: ", requestPriceObj, res);
      this.reservationPrice = 0
      this.submitRatedata = [];
      for(let priceNight = 0; priceNight < res['roomRate'].length; priceNight++){
        this.reservationPrice += res['roomRate'][priceNight].rateAmount*1;
        this.submitRatedata.push({
          "base": {
            "amountAfterTax": "",
            "amountBeforeTax": res['roomRate'][priceNight].rateAmount,
            "currencyCode": "INR"
          },
          "effectiveDate": moment(res['roomRate'][priceNight].checkinDate, "YYYY-MM-DD").format("YYYY-MM-DD 00:00:00.0"),
          "expireDate": moment(res['roomRate'][priceNight].checkoutDate, "YYYY-MM-DD").format("YYYY-MM-DD 23:59:59.9"),
          "rateTimeUnit": "Day",
          "unitMultiplier": "1"
        });
        //console.log("after get price: ", res['roomRate'][priceNight])
      }
      this.duePaymentCalculation();
    })
  }

  submit() {
    let data = this.form.getRawValue();
    //console.log("in submit: ", data);

    let params: IReservationData = {
      "pos": {
        "source": {
          "requestorID": {
            "id": "BMPMS",
            "type": "14"
          },
          "bookingChannel": {
            "companyName": {
              "value": "DirectBooking",
              "code": "6"
            },
            "primary": "1",
            "type": "5"
          }
        }
      },
      "hotelReservations": {
        "hotelReservation": [
          {
            "uniqueID": {
              "id": "",
              "type": "18"
            },
            "roomStays": {
              "roomStay": [
                {
                  "ratePlans": {
                    "ratePlan": [
                      {
                        "mealsIncluded": {
                          "mealPlanIndicator": "0",
                          "mealPlanCodes": "",
                          "mealPlanDescription": ""
                        },
                        "ratePlanCode": data.rateType
                      }
                    ]
                  },
                  "roomRates": {
                    "roomRate": [
                      {
                        "rates": {
                          "rate": this.submitRatedata
                        },
                        "numberOfUnits": data.roomCount,
                        "ratePlanCode": data.rateType,
                        "roomTypeCode": data.roomType,
                        "roomTypeDesc": data.roomDesc,
                        "promotionCode": ""
                      }
                    ]
                  },
                  "guestCounts": {
                    "guestCount": [
                      {
                        "ageQualifyingCode": "10",
                        "count": data.adultCount
                      },
                      {
                        "ageQualifyingCode": "8",
                        "count": data.childCount
                      }
                    ],
                    "isPerRoom": "1"
                  },
                  "timeSpan": {
                    "start": moment(data.start, "DD-MMM-YYYY").format("YYYY-MM-DD 00:00:00.0"),
                    "end": moment(data.end, "DD-MMM-YYYY").format("YYYY-MM-DD 23:59:59.9")
                  },
                  "guarantee": {
                    "guaranteesAccepted": {
                      "guaranteeAccepted": [
                        {
                          "paymentCard": {
                            "cardHolderName": data.cardHolderName,
                            "cardCode": data.cardCode,
                            "cardNumber": data.cardNumber,
                            "cardType": "1",
                            "expireDate": data.expireDate,
                            "seriesCode": data.seriesCode
                          }
                        }
                      ]
                    },
                    "guranteeDescription": {
                      "text": ""
                    },
                    "guaranteeType": "GuaranteeRequired",
                    "guranteeCode": "GCC"
                  },
                  "total": {
                    "taxes": {
                      "tax": [
                        {
                          "code": "",
                          "percent": "",
                          "type": ""
                        }
                      ],
                      "amount": "",
                      "currenyCode": "INR"
                    },
                    "amountAfterTax": this.reservationPrice,
                    "amountBeforeTax": this.reservationPrice,
                    "currencyCode": "INR",
                    "tpaextensions": null
                  },
                  "basicPropertyInfo": {
                    "brandCode": "",
                    "chainCode": "",
                    "hotelCode": "1"
                  },
                  "resGuestRPHs": {
                    "resGuestRPH": [
                      {
                        "rph": "1"
                      }
                    ]
                  },
                  "memberships": {
                    "membership": [
                      {
                        "accountID": "",
                        "programCode": ""
                      }
                    ]
                  },
                  "comments": {
                    "comment": [
                      {
                        "text": "test",
                        "guestViewable": "1"
                      }
                    ]
                  },
                  "specialRequests": {
                    "specialRequest": [
                      {
                        "content": "",
                        "codeContext": "",
                        "requestCode": ""
                      }
                    ]
                  },
                  "legNumber": null,
                  "roomStaySeqNo": null,
                  "numberOfUnits": data.roomCount,
                  "totalNoOfAdults": data.adultCount,
                  "totalNoOfChildren": data.childCount,
                  "assignedRoomNumber": data.resource,
                  "rtroomStayID": null
                }
              ]
            },
            "resGuests": {
              "resGuest": [
                {
                  "profiles": {
                    "profileInfo": [
                      {
                        "profile": {
                          "customer": {
                            "personName": {
                              "namePrefix": data.guestTitle,
                              "givenName": data.guestFname,
                              "middleName": "",
                              "surname": data.guestLname
                            },
                            "telephone": {
                              "formattedInd": "0",
                              "phoneLocationType": "7",
                              "phoneNumber": data.guestPhone,
                              "phoneTechType": "3"
                            },
                            "email": {
                              "content": data.guestEmail,
                              "emailType": "2"
                            },
                            "address": {
                              "addressLine": "Kolkata",
                              "cityName": "Kolkata",
                              "postalCode": "700156",
                              "stateProv": {
                                "stateCode": "WB"
                              },
                              "countryName": {
                                "code": null
                              },
                              "type": null
                            }
                          },
                          "profileType": "1"
                        }
                      }
                    ]
                  },
                  "arrivalTransport": {
                    "transportInfo": {
                      "id": "",
                      "time": "",
                      "type": ""
                    }
                  },
                  "departureTransport": {
                    "transportInfo": {
                      "id": "",
                      "time": "",
                      "type": ""
                    }
                  },
                  "resGuestRPH": "1",
                  "rtguestID": null
                }
              ]
            },
            "resGlobalInfo": {
              "hotelReservationIDs": {
                "hotelReservationId": [
                  {
                    "resIDValue": "",
                    "resIDType": "14",
                    "resIDSource": data.roomType
                  }
                ]
              }
            },
            "createDateTime": moment().format('YYYY-MM-DD'),
            "creatorID": "bmpms",
            "lastModifierID": null,
            "lastModifyDateTime": null,
            "reservationStatus": "New"
          }
        ]
      },
      "resStatus": "New",
      "timeStamp": moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
      "version": "1.003"
    };

    console.log("params: ", JSON.stringify(params));

    this.fdServ.createReservation(params).subscribe(res => {
      this.modal.hide();

      let eventData = {
        id: res['successList'][0]['bookingId'],
        start: moment(data.start, "DD-MMM-YYYY").format("YYYY-MM-DD 00:00:00.0"),
        end: moment(data.end, "DD-MMM-YYYY").format("YYYY-MM-DD 23:59:59.9"),
        text: data.guestTitle + ' ' + data.guestFname + ' ' + data.guestLname,
        resource: data.resource,
        otherData: {
          bookingStatus: "New"
        }
      }
      this.close.emit(eventData);

      //{"successList":[{"status":"Success","message":"Booking Created Successfully! Your Booking ID is: 7094","rowsUpdated":1,"bookingId":7094,"folioId":30012}]}
      if(res['successList'][0]['folioId']) {
        let paymentRequest = {
          "paymentType": "1",
          "paymentDesc": "Quick reservation payment",
          "paymentDate": moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
          "paymentMode": "1",
          "ccNo": "",
          "cashierName": this.userData.userName,
          "receiptNo": "",
          "folioId": res['successList'][0]['folioId'],
          "roomId": this.selectedRoomUnitId // for payment request 
        };

        if(data.depositAmt != ""){
          paymentRequest["paymentAmount"] = data.depositAmt;

          if(data.cardNumber != ""){
            paymentRequest.paymentMode = "2";
            paymentRequest.ccNo = data.cardNumber;
          }

          this.paymentService.makeBillPayment(paymentRequest).subscribe(res => {
            console.log("after payment response: ", res)
          });
        }
      }
    });

  }

  duePaymentCalculation() {
    this.form.controls['duePayment'].setValue(this.reservationPrice * 1 - this.form.controls['depositAmt'].value * 1);
    this.form.controls['duePayment'].patchValue(this.reservationPrice * 1 - this.form.controls['depositAmt'].value * 1);   
  }

  cancel() {
    this.modal.hide();
    this.close.emit();
  }

  /*closed(args) {
    this.close.emit(args);
  }*/

  dateTimeValidator(format: string) {
    return function (c: FormControl) {
      let valid = !!DayPilot.Date.parse(c.value, format);
      return valid ? null : { badDateTimeFormat: true };
    };
  }
}
