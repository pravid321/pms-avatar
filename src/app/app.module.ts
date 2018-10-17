import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UiModule } from './ui/ui.module';
import { AppRoutingModule } from './app.routing.module';
import { RouterModule } from '@angular/router';
import { DropdownDirective } from './shared/dropdown.directive';
import { RouteParameterService } from './shared/route.parameter.service';
import { JwtInterceptor } from './services/jwt.interceptor';
import { AuthGuard } from './shared/guards/auth.guard';


@NgModule({
  declarations: [
    //AuthService,
    AppComponent,
    LoginComponent,
    DropdownDirective,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    //AppRoutingModule,
    UiModule,
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
    )
  ],
  providers: [
    HttpClientModule,
    RouteParameterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
  // exports:[
  //   AppRoutingModule
  // ]
})
export class AppModule { }