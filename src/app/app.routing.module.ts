
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
//import { LoginModule } from './login/login.module';
import { UiModule } from './ui/ui.module';

const appRoutes: Routes = [
    { path: '**', component: PageNotFoundComponent }
  ]
@NgModule({
  
  imports: [
      RouterModule.forRoot(appRoutes)    
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
