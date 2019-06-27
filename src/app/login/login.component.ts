import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedin: boolean;
  invalidLogin: boolean;
  globalResponse: any;
  authHeaders: any;
  frgtBtnBlocked: boolean = true;
  saveLoginCredentials: boolean;
  existingLoginCrediantials: boolean;
  alertMsg: string;

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
    this.existingLoginCrediantials = this._auth.fetchLoginCredentials();
    console.log("got username & pass: ", this.existingLoginCrediantials);      

    if(this.existingLoginCrediantials){
      this.saveLoginCredentials = true;  
      this.callResponse(
        atob(this.existingLoginCrediantials['keyHead']),
        atob(this.existingLoginCrediantials['keyValue'])
      );
    }
  }

  login(event: any) {

    this.isLoggedin = false;
    this._auth.removeToken();

    const target = event.target;
    const username = target.querySelector('#username').value;
    const password = target.querySelector('#password').value;
    
    this.callResponse(username, password);
  }

  callResponse(user: string, pass: string){
    this._auth.getUserDetails(user, pass)
      .subscribe((result) => {
        console.log("--->", result, result.headers.get('Content-Type'), result.headers.get('authToken'));
        this.globalResponse = result.body;
        this.authHeaders = result.headers;
      },
        error => {
          //console.log(error.message, "invalid username or password");
          this.invalidLogin = true;
          this.alertMsg = "Invalid username or password";
          $(".alert-danger").fadeTo(2000, 500).slideUp(500, function () {
            $(".alert-danger").slideUp(500);
          });
          this.existingLoginCrediantials = false;
        },
        () => {
          // this is the sueccessful login part
          if(this.globalResponse.is_Valid == false && this.globalResponse.subsStatus.toLowerCase() == 'expired'){
            this.invalidLogin = true;
            this.isLoggedin = false;
            this.existingLoginCrediantials = false;
            this.alertMsg = "Your subscription has expired";
            $(".alert-danger").fadeTo(2000, 500).slideUp(500, function () {
              $(".alert-danger").slideUp(500);
            });
          } else { 
            this.alertMsg = "";
            this._auth.storeToken(this.authHeaders.get('authToken'));
            this._auth.setAllowedModules(this.globalResponse.modulesAllowed.modules);
            this.invalidLogin = false;
            this.isLoggedin = true;
            if(this.saveLoginCredentials){
              this._auth.saveLoginCredentialsInCookie(btoa(user), btoa(pass));
            }
            this._router.navigateByUrl('/ui/dashboard');
          }
        }
      );
  }

  onKey(emailVal: string){

    //ar re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let emailExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(emailExp.test(String(emailVal).toLowerCase())){
      $("#frgtemail").css({'border-color': '#ced4da'});
      this.frgtBtnBlocked = false;
    }else{
      $("#frgtemail").css({'border-color': 'red'});
      this.frgtBtnBlocked = true;
    }
  }

}
