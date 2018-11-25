import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class UserDataService {

   /* userData: any;

    constructor(private _authServ: AuthService) {}

    getUserDetails(){

        if(typeof this.userData !== 'undefined'){
            return this.userData;
        }else{
            this._authServ.fetchUserDetails().subscribe( userResponse => {
                this.userData = userResponse;
            });
            return this.userData;
        }
        
    }*/

    constructor(private _authServ: AuthService) {}

    private userData = new BehaviorSubject({});

    loggedUserData = this.userData.asObservable();

    setUserData(loggedUserData){
        this.userData.next(loggedUserData);
    }

    getUserDetails(){
        console.log("in getUserDetails: ", Object(this.userData).length);
        /*if(typeof this.userData !== 'undefined' || this.userData.value !== {}){
        }else{*/
            if(typeof Object(this.userData).length == 'undefined'){
                this._authServ.fetchUserDetails()
                .subscribe( userResponse => {
                    this.userData.next(userResponse);
                });
                return this.userData.asObservable();
            }else{
                return this.userData.asObservable();
            }
        //}
    }
}