import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let authToken = localStorage.getItem("token");
        if (authToken) {
            request = request.clone({
                setHeaders: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    Authorization: `${authToken}`                    
                }
            });
        }else {
            request = request.clone({
                setHeaders: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*"                
                }
            });
        }
 
        return next.handle(request);
    }
}