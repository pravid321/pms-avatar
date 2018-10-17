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
    }).pipe(map(res => res),
      catchError(this.errorHandler)
    );
  }

  errorHandler( error: Response){
    console.log("error");
    return throwError(error);
  }

  public isAuthenticated(): boolean{
    return this.getToken() !== null;
  }

  storeToken(token: string){
    localStorage.setItem("token", token);
  }

  getToken(){
    return localStorage.getItem("token");
  }

  removeToken(){
    return localStorage.removeItem("token");
  }

  setAllowedModules(allowedModuleList){
    localStorage.setItem("allowedModules", JSON.stringify(allowedModuleList));
  }

  getAllowedModules(){
    return localStorage.getItem("allowedModules");
  }

  isAccessableModule(routeModule): boolean{
    let allowedModules = JSON.parse(localStorage.getItem("allowedModules"));
    //console.log("in isAccessable module: ", allowedModules, routeModule, allowedModules.find(moduleObj =>  moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName));//this.allowedModules.find(moduleObj => { moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName }));

    let isModuleExists = allowedModules.find(moduleObj =>  moduleObj.moduleID == routeModule.moduleID && moduleObj.moduleName == routeModule.moduleName);
    
    return typeof isModuleExists !== 'undefined' ? true : false;
  }

}
