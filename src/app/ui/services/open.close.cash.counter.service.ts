import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class OpenCloseCashCounterService {

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

    openCashCounter(options: any) {
        let servUrl = environment.apiUrl;
        let openCashCounterUrl = servUrl + 'Config/Billings/openCashCounter/' + this.userHotelID;
        //let openCashCounterUrl = servUrl + 'NightAudit/openCashCounter/' + this.userHotelID;

        return this._http.post(openCashCounterUrl, options)
            .pipe(
                map(res => res), 
                catchError(this.errorHandler)
            );
    }

    closeCashCounter(options: any) {
        let servUrl = environment.apiUrl;
        let closeCashCounterUrl = servUrl + 'Config/Billings/closeCashCounter/' + this.userHotelID;
        //let closeCashCounterUrl = servUrl + 'NightAudit/closeCashCounter/' + this.userHotelID;

        return this._http.post(closeCashCounterUrl, options)
            .pipe(
                map(res => res), 
                catchError(this.errorHandler)
            );
    }

    getTransactionSummary(optinons: any) {
        let servUrl = environment.apiUrl;
        let fetchTransactionSummaryUrl = servUrl + 'Accounts/Billings/getTransactionSummary/' + this.userHotelID;

        /*let response = {
            "transactionSumarry": [
                {
                    "tranxSumarryId": 11,
                    "transactionDate": "2019-06-07",
                    "transactionMode": "Cash",
                    "openingbalance": 6000,
                    "collection": 4500,
                    "widrawals": 960,
                    "closingAmount": 0,
                    "descripency": 10,
                    "balanceInHand": 0,
                    "counterId": 1
                },
                {
                    "tranxSumarryId": 12,
                    "transactionDate": "2019-06-07",
                    "transactionMode": "Credit Card",
                    "openingbalance": 0,
                    "collection": 4400,
                    "widrawals": 0,
                    "closingAmount": 50,
                    "descripency": 0,
                    "balanceInHand": 0,
                    "counterId": 1
                },
                {
                    "tranxSumarryId": 13,
                    "transactionDate": "2019-06-07",
                    "transactionMode": "Online Payment",
                    "openingbalance": 10,
                    "collection": 4000,
                    "widrawals": 0,
                    "closingAmount": 0,
                    "descripency": 0,
                    "balanceInHand": 70,
                    "counterId": 1
                }
            ]
        };

        return of(response);*/

        return this._http.post(fetchTransactionSummaryUrl, optinons)
        .pipe(
            map(res => res),
            catchError(this.errorHandler)
        );
    }
}