import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import moment from 'moment';

import { FrontDeskService } from '../../services/front.desk.services';
import { IRatePlan, IRoom, IReservationData } from '../Frontdesk';

@Component({
  selector: 'app-ui-frontdesk-booking-details',
  templateUrl: './booking.details.component.html'
})
export class BookingDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  
  public config: PerfectScrollbarConfigInterface = {};

  @Input() bookingData: any;
  @Input() roomList: IRoom[];
  @Input() ratePlanList: IRatePlan[];

  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };
  scrollBarContainerHeight:number = 0;
  selectedRoomItem: any;
  noOfNights: number;

  bsConfigStart: Partial<BsDatepickerConfig>;
  bsConfigEnd: Partial<BsDatepickerConfig>;

  constructor(private fdServ: FrontDeskService){}

  ngOnInit() {
    let buffer = 50;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $(".frontdesk-header").outerHeight() + $("#pageFooter").outerHeight() + $("#uiFooter").outerHeight() + buffer);
    
    this.fdServ.getBookingDetails(this.bookingData.bookingID).subscribe(res => {
      console.log("complete bookings data: ", res);
    });

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
    
    this.roomChanged(this.bookingData.roomtype, this.bookingData.assignedRoomNumber);    
    this.noOfNights = moment(this.bookingData.departureDate).diff(moment(this.bookingData.arrivalDate), 'days');

    console.log("on booking details: ", this.bookingData);
  }

  ngAfterViewInit() {
    //this.bookingData.arrivalDate = moment(this.bookingData.arrivalDate, 'YYYY-MM-DD HH:mm:ss.S').format('DD-MMM-YYYY');
    //this.bookingData.departureDate = moment(this.bookingData.departureDate, 'YYYY-MM-DD HH:mm:ss.S').format('DD-MMM-YYYY');
    //console.log("primaryColorSample:", this.roomList, this.ratePlanList, JSON.stringify(this.bookingData));
    //this.roomChanged(this.bookingData.roomtype);
  }

  public roomChanged(roomCode: any, assignedRoomNumber: any) {
    this.selectedRoomItem = this.roomList.find(roomItem => roomItem.roomCode == roomCode);
    if (assignedRoomNumber == '') {
      this.bookingData.assignedRoomNumber = this.selectedRoomItem.roomNumbers[0];
    }
  }

  public getRatePlan(ratePlanCode: string): string {
    let selectedRateItem = this.ratePlanList.find(rateItem => rateItem.ratePlanCode == ratePlanCode);
    return selectedRateItem.ratePlanName;
  }

  public getRoomType(roomTypeCode: string): string {
    let roomCodeVal = this.roomList.find(roomItem => roomItem.roomCode == roomTypeCode);
    return roomCodeVal.roomName;
  }

  public updateReservationData(dataVal: any, type: string) {
    if(type == 'adult')
      this.bookingData.adult = dataVal;
    else if(type == 'child') 
      this.bookingData.child = dataVal;
    else if(type == 'ratePlan') 
      this.bookingData.ratePlan = dataVal;
    else if(type == 'roomItem') 
      this.bookingData.roomtype = dataVal;
  }

  public modifyReservation() {
    
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
                        "ratePlanCode": this.bookingData.ratePlan
                      }
                    ]
                  },
                  "roomRates": {
                    "roomRate": [
                      {
                        "rates": {
                          "rate": []
                        },
                        "numberOfUnits": this.bookingData.numberOfRooms,
                        "ratePlanCode": this.bookingData.ratePlan,
                        "roomTypeCode": this.bookingData.roomtype,
                        "roomTypeDesc": this.selectedRoomItem.roomDesc,
                        "promotionCode": ""
                      }
                    ]
                  },
                  "guestCounts": {
                    "guestCount": [
                      {
                        "ageQualifyingCode": "10",
                        "count": this.bookingData.adult
                      },
                      {
                        "ageQualifyingCode": "8",
                        "count": this.bookingData.child
                      }
                    ],
                    "isPerRoom": "1"
                  },
                  "timeSpan": {
                    "start": moment(this.bookingData.arrivalDate, "DD-MMM-YYYY").format("YYYY-MM-DD 00:00:00.0"),
                    "end": moment(this.bookingData.departureDate, "DD-MMM-YYYY").format("YYYY-MM-DD 23:59:59.9")
                  },
                  "guarantee": {
                    "guaranteesAccepted": {
                      "guaranteeAccepted": [
                        {
                          "paymentCard": {
                            "cardHolderName": "Dummy Card",
                            "cardCode": "VS",
                            "cardNumber": "4222222222222222",
                            "cardType": "1",
                            "expireDate": "1219",
                            "seriesCode": "123"
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
                    "amountAfterTax": "998.0",
                    "amountBeforeTax": "998.0",
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
                  "numberOfUnits": this.bookingData.numberOfRooms,
                  "totalNoOfAdults": this.bookingData.adult,
                  "totalNoOfChildren": this.bookingData.child,
                  "assignedRoomNumber": this.bookingData.assignedRoomNumber,
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
                              "namePrefix": this.bookingData.guestDetails.guestDetail[0].namePrefix,
                              "givenName": this.bookingData.guestDetails.guestDetail[0].givenName,
                              "middleName": this.bookingData.guestDetails.guestDetail[0].middleName,
                              "surname": this.bookingData.guestDetails.guestDetail[0].surName,
                            },
                            "telephone": {
                              "formattedInd": "0",
                              "phoneLocationType": "7",
                              "phoneNumber": this.bookingData.guestDetails.guestDetail[0].phone,
                              "phoneTechType": "3"
                            },
                            "email": {
                              "content": this.bookingData.guestDetails.guestDetail[0].email,
                              "emailType": "2"
                            },
                            "address": {
                              "addressLine": this.bookingData.guestDetails.guestDetail[0].address1,
                              "cityName": this.bookingData.guestDetails.guestDetail[0].city,
                              "postalCode": this.bookingData.guestDetails.guestDetail[0].zipCode,
                              "stateProv": {
                                "stateCode": this.bookingData.guestDetails.guestDetail[0].state
                              },
                              "countryName": {
                                "code": this.bookingData.guestDetails.guestDetail[0].country
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
                    "resIDValue": this.bookingData.bookingID,
                    "resIDType": "14",
                    "resIDSource": this.bookingData.roomtype
                  }
                ]
              }
            },
            "createDateTime": moment().format('YYYY-MM-DD'),
            "creatorID": "bmpms",
            "lastModifierID": null,
            "lastModifyDateTime": null,
            "reservationStatus": "Modify"
          }
        ]
      },
      "resStatus": "Modify",
      "timeStamp": moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
      "version": "1.003"
    };

    let startDate = moment(this.bookingData.arrivalDate, 'DD-MMM-YYYY').clone();
    while(moment(this.bookingData.departureDate, "DD-MMM-YYYY").diff(moment(startDate, 'DD-MMM-YYYY')) > 0) {
      params.hotelReservations.hotelReservation[0].roomStays.roomStay[0].roomRates.roomRate[0].rates.rate.push({        
          "base": {
            "amountAfterTax": "998.0",
            "amountBeforeTax": "998.0",
            "currencyCode": "INR"
          },
          "effectiveDate": moment(startDate, "DD-MMM-YYYY").format("YYYY-MM-DD 00:00:00.0"),
          "expireDate": moment(startDate, "DD-MMM-YYYY").add(1, 'days').format("YYYY-MM-DD 23:59:59.9"),
          "rateTimeUnit": "Day",
          "unitMultiplier": "1"
        })
      startDate = startDate.add(1, 'days');
    }

    console.log("params: ", params);


    this.fdServ.createReservation(params).subscribe(res => {
      //this.modal.hide();
      console.log('in modify reservation: ', res);
      this.alertMessageDetails.response = true;

      if(res['successList'][0]['status'].toLowerCase() == 'success'){
          this.alertMessageDetails.type = 'success';
          this.alertMessageDetails.message = "Reservation details updated successfully";
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Reservation details not updated! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);

    });
  }
}