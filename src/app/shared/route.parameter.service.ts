import { Injectable } from '@angular/core';

@Injectable()
export class RouteParameterService {

    constructor() { }

    appRoute = {
        url: "",
        pageName: ""
    }

    setParam(paramObj){
        this.appRoute.url = paramObj.url;
        this.appRoute.pageName = paramObj.pageName;
    }

    getParam() {
        return this.appRoute;
    }
}  