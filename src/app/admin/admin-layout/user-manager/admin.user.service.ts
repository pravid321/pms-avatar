import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

import { AdminResourceService } from '../../services/admin.resource.service';
import { UserResolver } from '../../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class AdminUserService extends AdminResourceService {

    constructor(private httpClient: HttpClient, private _userResolver: UserResolver) {
        super(httpClient, _userResolver.getHotelID());
    }    

    public getEmployeeDetails(servicePath: string): Observable<any> {
        return this.httpClient
            .post(this.url + servicePath, {})
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );
    }

    public updateEmployeeDetails(servicePath: string, options: any): Observable<any> {
        return this.httpClient.post(this.url + servicePath, options).pipe(
            map(res => res),
            catchError(this.errorHandler)
        );
    }
}