import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  paramDetails:any;

  now:number;

  constructor(private _router : Router, private _auth: AuthService) {
    this.now = Date.now(); 
    setInterval(() => {
      this.now = Date.now();
    }, 10000);
  }

  ngOnInit() { }

  /*ngOnChanges(changes: SimpleChanges){
    console.log("in on changes: ", changes.paramDetails['pageName']);
  }*/

  logout(){
    this._auth.removeToken();
    //this._router.navigateByUrl('/login');
  }

}
