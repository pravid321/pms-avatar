
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthGuard } from '../shared/guards/auth.guard';
import { BillingsComponent } from './billings/billings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontdeskComponent, frontDeskChildComponents } from './frontdesk/frontdesk.component';
import { HousekeepingComponent } from './housekeeping/housekeeping.component';
import { LayoutComponent } from './layout/layout.component';
import { OthersComponent } from './others/others.component';
import { ReportsComponent } from './reports/reports.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RoleGuard } from '../shared/guards/role.guard';
import { UserResolver } from '../shared/user.resolver.service';

export const uiRoutingComponent = [BillingsComponent, DashboardComponent, FrontdeskComponent, frontDeskChildComponents, HousekeepingComponent, RestaurantComponent, ReportsComponent, OthersComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {
          path: 'ui',
          component: LayoutComponent,
          resolve: {
            user: UserResolver
          },
          children: [
            {
              /* leading slash should not be given in the path */
              path: '',
              redirectTo: '/ui/dashboard', /* in redirectTo the leading slash is required */
              pathMatch: 'full',
              canActivate: [AuthGuard]
            },
            {
              path: 'dashboard',
              component: DashboardComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'frontdesk',
              component: FrontdeskComponent,
              canActivate: [AuthGuard && RoleGuard],
              data:{
                moduleID: 1,
                moduleName: "FrontDesk"
              }
            },
            {
              path: 'restaurant',
              component: RestaurantComponent,
              canActivate: [AuthGuard && RoleGuard],
              data:{
                moduleID: 2,
                moduleName: "Reservation"
              }
            },
            {
              path: 'housekeeping',
              component: HousekeepingComponent,
              canActivate: [AuthGuard && RoleGuard],
              data:{
                moduleID: 3,
                moduleName: "House Keeping"
              }
            },
            {
              path: 'reports',
              component: ReportsComponent,
              canActivate: [AuthGuard && RoleGuard],
              data:{
                moduleID: 4,
                moduleName: "Reports"
              }
            },
            {
              path: 'others',
              component: OthersComponent,
              canActivate: [AuthGuard && RoleGuard],
              data:{
                moduleID: 5,
                moduleName: "Others"
              }
            },
            {
              path: 'billings',
              component: BillingsComponent,
              data:{
                moduleID: 6,
                moduleName: "Billings"
              }
            },

          ]
        },
      ]
    )
  ],
  exports: [CommonModule, RouterModule]
})
export class UiRoutingModule { }
