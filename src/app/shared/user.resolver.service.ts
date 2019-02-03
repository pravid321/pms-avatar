import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<any> {

    constructor(private _http: HttpClient) { }

    private userDetails: any = undefined;

    resolve(): Observable<any> {
        if (this.userDetails) {
            return this.getSavedUserDetails();
        } else {
            return this.getUserDetailsFromApi()
        }
    }

    getUserData() {
        return this.userDetails;
    }

    getHotelID() {
        return this.userDetails.hotelID;
    }

    private getSavedUserDetails() {
        console.log('Getting saved user details');
        return of(this.userDetails);
    }

    private getUserDetailsFromApi() {
        console.log('Getting api user details');
        let servUrl = environment.apiUrl;
        let userDataUrl = servUrl + 'getLoginData';

        return this._http.post(userDataUrl, {}).pipe(
            tap((userDataFromApi) => {
                console.log("userDataFromApi: ", userDataFromApi);
                this.userDetails = userDataFromApi
            }),
            map((userDataFromApi) => userDataFromApi),
            catchError((err) => Observable.throw(err.json().error))
        );

    }
}