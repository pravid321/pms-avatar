import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  getUserDetails(username, password) {
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

  setAllowedModules(allowedModuleList) {
    localStorage.setItem("allowedModules", JSON.stringify(allowedModuleList));
  }

  getAllowedModules() {
    return localStorage.getItem("allowedModules");
  }

  isAccessableModule(routeModule): boolean {
    let allowedModules = JSON.parse(localStorage.getItem("allowedModules"));
    console.log("in isAccessable module: ", allowedModules, routeModule);//, allowedModules.find(moduleObj =>  moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName));//this.allowedModules.find(moduleObj => { moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName }));
    if (typeof allowedModules !== 'undefined' && allowedModules !== null) {
      let isModuleExists = allowedModules.find(moduleObj => moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName);
      return typeof isModuleExists !== 'undefined' ? true : false;
    } else
      return false;

  }

}
