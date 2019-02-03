import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  cookieKeyUser: string = 'U$517';
  cookieKeyPass: string = 'P@$$';

  constructor(private cookieService: CookieService, private _http: HttpClient) { }

  getUserDetails(username: string, password: string) {
    // post these details to API server return user info if correct
    let servUrl = environment.apiUrl;
    servUrl += 'login';
    return this._http.post(servUrl, {
      "userName": username,
      //"email": username,
      "password": password
    }, {
        responseType: 'json',
        observe: 'response'
      }).pipe(map(res => {
        //console.log("response header: ", res);
        return res;
      }),
        catchError(this.errorHandler)
      );
  }

  fetchUserDetails() {
    let servUrl = environment.apiUrl;
    let userDataUrl = servUrl + 'getLoginData/1';

    return this._http.post(userDataUrl, {}).pipe(map(res => {      
      return res;
    }),
      catchError(this.errorHandler)
    );
  }

  errorHandler(errorRes: Response) {
    console.log("error: ", errorRes, errorRes.status);
    //if(errorRes.headers.status)
    return throwError(errorRes);
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  storeToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  removeToken() {
    return localStorage.removeItem("token");
  }

  setAllowedModules(allowedModuleList: any) {
    localStorage.setItem("allowedModules", JSON.stringify(allowedModuleList));
  }

  getAllowedModules() {
    return localStorage.getItem("allowedModules");
  }

  isAccessableModule(routeModule: any): boolean {
    let allowedModules = JSON.parse(localStorage.getItem("allowedModules"));
    console.log("in isAccessable module: ", allowedModules, routeModule);//, allowedModules.find(moduleObj =>  moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName));//this.allowedModules.find(moduleObj => { moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName }));
    if (typeof allowedModules !== 'undefined' && allowedModules !== null) {
      let isModuleExists = allowedModules.find(moduleObj => moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName);
      return typeof isModuleExists !== 'undefined' ? true : false;
    } else
      return false;
  }

  fetchLoginCredentials(): any{
    const cookieExists: boolean = this.cookieService.check(this.cookieKeyUser) && this.cookieService.check(this.cookieKeyPass);
    if(cookieExists){
      return {
        'keyHead': this.cookieService.get(this.cookieKeyUser),
        'keyValue': this.cookieService.get(this.cookieKeyPass)
      }
    } else {
      return false;
    }
  }

  saveLoginCredentialsInCookie(base64User: string, base64Pass: string){
    // date.setTime(date.getTime() + ( 24 * 60 * 60 * 1000));
    //let expires = date.toUTCString();
    //console.log("expiry data: ", date, expires);
    
    let expDate = new Date();
    expDate.setDate( expDate.getDate() + 1 );
    
    this.cookieService.set( this.cookieKeyUser, base64User, expDate);
    this.cookieService.set( this.cookieKeyPass, base64Pass, expDate);
  }

  removeLoginCredentialsInCookie(){
    this.cookieService.delete(this.cookieKeyUser);
    this.cookieService.delete(this.cookieKeyPass);
  }

}
