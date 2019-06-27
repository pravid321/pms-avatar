
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthGuard } from '../shared/guards/auth.guard';
import { BillingsComponent } from './billings/billings.component';
import { CloseCashCounterComponent } from './cash-counter/close-counter/close.cash.counter.component';
import { CounterResolverService } from '../shared/counter.resolver.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontdeskComponent, frontDeskChildComponents } from './frontdesk/frontdesk.component';
import { GuestLookupComponent } from './guestlookup/guestlookup.component';
import { HousekeepingComponent } from './housekeeping/housekeeping.component';
import { LayoutComponent } from './layout/layout.component';
import { OpenCashCounterComponent } from './cash-counter/open-counter/open.cash.counter.component';
import { OthersComponent } from './others/others.component';
import { NightAuditComponent } from './night-audit/night.audit.component';
import { PaymentsComponent } from './payments/payments.component';
import { ReportsComponent, reportsChildComponents } from './reports/reports.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RoleGuard } from '../shared/guards/role.guard';
import { TariffChartComponent } from './tariffchart/tariffchart.component';
import { UserResolver } from '../shared/user.resolver.service';

export const uiRoutingComponent = [
  BillingsComponent, CloseCashCounterComponent, DashboardComponent, 
  FrontdeskComponent, frontDeskChildComponents, GuestLookupComponent, 
  HousekeepingComponent, NightAuditComponent, OpenCashCounterComponent, 
  PaymentsComponent, RestaurantComponent, 
  ReportsComponent, reportsChildComponents, 
  OthersComponent, TariffChartComponent
];

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
              path: 'nightaudit',
              component: NightAuditComponent,
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
                moduleID: 5,
                moduleName: "Restaurent"
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
              //canActivate: [AuthGuard],
              data:{
                moduleID: 7,
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
              canActivate: [AuthGuard && RoleGuard],
              data:{
                moduleID: 8,
                moduleName: "Billings"
              }
            },
            {
              path: 'opencounter',
              component: OpenCashCounterComponent,
              canActivate: [AuthGuard && RoleGuard],
              resolve: {
                counterData: CounterResolverService
              },
              data:{
                moduleID: 10,
                moduleName: "Cash Counter"
              }
            },
            {
              path: 'closecounter',
              component: CloseCashCounterComponent,
              canActivate: [AuthGuard && RoleGuard],
              resolve: {
                counterData: CounterResolverService
              },
              data:{
                moduleID: 10,
                moduleName: "Cash Counter"
              }
            },
            //this is temporary basic after completion html it should be removed
            {
              path: 'tariff',
              component: TariffChartComponent,
              canActivate: [AuthGuard]
            }
          ]
        },
      ]
    )
  ],
  exports: [CommonModule, RouterModule]
})
export class UiRoutingModule { }
