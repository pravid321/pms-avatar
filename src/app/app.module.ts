import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
//import { AppRoutingModule } from './app.routing.module';
import { AuthGuard } from './shared/guards/auth.guard';
import { ConfirmPopupComponent } from './shared/components/confirm.popup.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { JwtInterceptor } from './services/jwt.interceptor';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouteParameterService } from './shared/route.parameter.service';
import { UiModule } from './ui/ui.module';


@NgModule({
  declarations: [
    AppComponent,
    //AuthService,
    ConfirmPopupComponent,
    DropdownDirective,
    LoginComponent,
    PageNotFoundComponent
  ],
  imports: [
    AdminModule,
    //AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      [
        {
          path: 'login',
          component: LoginComponent
        },
        {
          /* leading slash should not be given in the path */
          path: '',
          redirectTo: '/login', /* in redirectTo the leading slash is required */
          pathMatch: 'full',
          canActivate: [AuthGuard]
        },
        {
          path: '**',
          component: PageNotFoundComponent
        }
      ]
    ),
    UiModule
  ],
  providers: [
    CookieService,
    HttpClientModule,
    RouteParameterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  entryComponents: [ ConfirmPopupComponent ],
  bootstrap: [ AppComponent ]
  // exports:[
  //   AppRoutingModule
  // ]
})
export class AppModule { }
