import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { LoadingIndicatorModule } from '@btapai/ng-loading-indicator';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { AppRoutingModule, appRoutingComponent } from './app.routing.module';
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
    ConfirmPopupComponent,
    DropdownDirective,
    LoginComponent,
    PageNotFoundComponent,
    appRoutingComponent
  ],
  imports: [
    AdminModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    //LoadingIndicatorModule.forRoot(), // place it into the imports array 
    RouterModule.forRoot(
      [       
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
  entryComponents: [ConfirmPopupComponent],
  bootstrap: [AppComponent],
   exports:[
     AppRoutingModule
   ]
})
export class AppModule { }
