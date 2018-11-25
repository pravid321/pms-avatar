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

  constructor(private _router: Router, private _auth: AuthService) { }

  ngOnInit() {
  }

  login(event) {

    this.isLoggedin = false;
    this._auth.removeToken();

    const target = event.target;
    const username = target.querySelector('#username').value;
    const password = target.querySelector('#password').value;


    this._auth.getUserDetails(username, password)
      .subscribe((result) => {
        console.log("--->", result.headers, result.headers.get('Content-Type'), result.headers.get('authToken'));
        this.globalResponse = result.body;
        this.authHeaders = result.headers;
      },
        error => {
          //console.log(error.message, "invalid username or password");
          this.invalidLogin = true;
          $(".alert-danger").fadeTo(2000, 500).slideUp(500, function () {
            $(".alert-danger").slideUp(500);
          });

        },
        () => {
          // this is the sueccessful login part
          this._auth.storeToken(this.authHeaders.get('authToken'));
          //this._auth.storeToken('Vml2ZWtHOldlbGNvbWVAMTIz');
          this._auth.setAllowedModules(this.globalResponse.modulesAllowed.modules);
          this.invalidLogin = false;
          this.isLoggedin = true;
          this._router.navigateByUrl('/ui/dashboard');
        }
      );

    //console.log("in login component::::", event, username, password);
  }

}
