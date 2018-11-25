import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FrontDeskService {
    constructor(private _http: HttpClient) { }

    getRoomRateDetails(){
        let servUrl = environment.apiUrl;
        let roomUrl = servUrl+'Rooms/getRooms/1';
        let rateUrl = servUrl+'Rateplans/getRateplans/1';
        
        let roomResponse = this._http.post(roomUrl,{}).pipe(map(res => {
            return res['rooms'];
        }));

        let rateResponse = this._http.post(rateUrl,{}).pipe(map(res => {
            return res['ratePlans'];
        }));
        
        return forkJoin(
            roomResponse,
            rateResponse
        );
    }
    
    getReservationDetails(options) {
        let servUrl = environment.apiUrl;
        let gridInfoUrl = servUrl + 'gridInfo/1/' + options.startDate + '/' + options.endDate;

        return this._http.post(gridInfoUrl,{}).pipe(map(res => res));

    }
}