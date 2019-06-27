import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';
import { ICheckInCardData, ICheckOutCardData } from '../frontdesk/CheckInOutCard';

@Injectable({
    providedIn: 'root'
})
export class BookingOperationsService {
    userHotelID: String;

    constructor(
        private _userResolver: UserResolver,
        private _http: HttpClient
    ) {
        this.userHotelID = this._userResolver.getHotelID();
    }

    errorHandler(errorRes: Response) {
        console.log("error: ", errorRes, errorRes.status);
        return throwError(errorRes);
    }

    getCheckInCardDetails(bookingId: string) {
        let servUrl = environment.apiUrl;
        let fetchCheckInDetailsUrl = servUrl + 'Bookings/BookingOperations/getCheckinCard/' + bookingId + '/' + this.userHotelID;

        /*
        let responseData: ICheckInOutCardData = {
            "hotelDetails": {
                "hotelName": "Test Hotel",
                "address": "Newtown , Kolkata",
                "city": "Kolkata",
                "zipCode": "700156",
                "phone": "1234567890",
                "email": "123@gmail.com",
                "website": "www.testhotel.com"
            },
            "resData": {
                "bookingID": 16098,
                "channelRefNum": "1555506219480",
                "bookingDate": "2019-04-17 18:33:39.55",
                "arrivalDate": "2019-04-16 00:00:00.0",
                "departureDate": "2019-04-17 23:59:59.9",
                "los": 1,
                "adult": 1,
                "child": 1,
                "roomtype": "DLX",
                "ratePlan": "BAR",
                "totalAmountAfterTax": 970,
                "assignedRoomNumber": "101",
                "guestDetail": {
                    "guestDetail": [
                        {
                            "guestID": 0,
                            "namePrefix": "Mr.",
                            "givenName": "Mayank",
                            "middleName": "",
                            "surName": "Biswas",
                            "address1": "Kolkata",
                            "address2": null,
                            "city": "Kolkata",
                            "state": "WB",
                            "country": "",
                            "zipCode": "700158",
                            "phone": "1230954320",
                            "email": "MB@max.com",
                            "isPrimary": 0,
                            "guestRPH": null
                        }
                    ]
                }
            },
            "totalbill": {
                "billId": 60002,
                "bookingTotal": 970,
                "roomCharge": 970,
                "mealCharge": 0,
                "otherCharges": 0,
                "taxPercentage": 0,
                "amountAfterTax": 0,
                "taxAmount": 0,
                "totalPaidAmount": 0,
                "balanceAmount": 970,
                "active": true
            }
        };
        */

        //return of(responseData);

        return this._http.post(fetchCheckInDetailsUrl, {})
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );
    }

    getCheckOutCardDetails(bookingId: string) {
        let servUrl = environment.apiUrl;
        let fetchCheckOutDetailsUrl = servUrl + 'Bookings/BookingOperations/getCheckoutCard/' + bookingId + '/' + this.userHotelID;

        /*let responseData: ICheckOutCardData = {
            "hotelDetails": {
                "hotelName": "Test Hotel",
                "address": "Newtown , Kolkata",
                "city": "Kolkata",
                "zipCode": "700156",
                "phone": "1234567890",
                "email": "123@gmail.com",
                "website": "www.testhotel.com"
            },
            "resData": {
                "bookingID": 16096,
                "channelRefNum": "1555499756341",
                "bookingDate": "2019-04-17 16:45:57.02",
                "arrivalDate": "2019-04-17 00:00:00.0",
                "departureDate": "2019-04-18 23:59:59.9",
                "los": 1,
                "adult": 1,
                "child": 1,
                "roomtype": "DLX",
                "ratePlan": "BAR",
                "totalAmountAfterTax": 978,
                "assignedRoomNumber": "102",
                "guestDetail": {
                    "guestDetail": [
                        {
                            "guestID": 15038,
                            "namePrefix": "Mrs.",
                            "givenName": "Naina",
                            "middleName": "",
                            "surName": "Maheswari",
                            "address1": "Kolkata",
                            "address2": null,
                            "city": "Kolkata",
                            "state": "WB",
                            "country": "",
                            "zipCode": "700159",
                            "phone": "1234554320",
                            "email": "mnk@max.com",
                            "isPrimary": 0,
                            "guestRPH": null
                        }
                    ]
                }
            },
            "billDetails": {
                "transactions": [
                    {
                        "tranxId": 70013,
                        "bookingId": "16096",
                        "tranxDesc": "Full SettelMent",
                        "tranxDate": "2019-04-21 23:14:58.89",
                        "folioId": "20004",
                        "roomId": "2",
                        "currency": "INR",
                        "tranxAmount": 978,
                        "discount": 0,
                        "tax": 0,
                        "payment": 0
                    },
                    {
                        "tranxId": 70015,
                        "bookingId": "16096",
                        "tranxDesc": "Full SettelMent",
                        "tranxDate": "2019-04-21 23:26:21.797",
                        "folioId": "20004",
                        "roomId": "2",
                        "currency": "INR",
                        "tranxAmount": 978,
                        "discount": 0,
                        "tax": 0,
                        "payment": 978
                    }
                ],

                "totalBill": {
                    "billId": 50002,
                    "bookingTotal": 978,
                    "roomCharge": 978,
                    "mealCharge": 0,
                    "otherCharges": 0,
                    "taxPercentage": 0,
                    "amountAfterTax": 978,
                    "taxAmount": 0,
                    "totalPaidAmount": 978,
                    "balanceAmount": 0,
                    "active": true
                }
            },
            "dayWiseTransaction": [
                {
                    "date": "2019-04-17 00:00:00.0",
                    "description": "Tejal_All mealPlan Room Rent DLX/102",
                    "tranxAmount": "978.0"
                }
            ]
        };

        return of(responseData);*/

        return this._http.post(fetchCheckOutDetailsUrl, {})
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );
    }
}