
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminCancellationPolicyComponent } from './admin-layout/policy-manager/cancellation-policy/admin.cancellation.policy.component';
import { AdminCheckinCheckoutPolicyComponent } from './admin-layout/policy-manager/checkin-chekout-policy/admin.checkin.checkout.policy.component';
import { AdminChildPolicyComponent } from './admin-layout/policy-manager/child-policy/admin.child.policy.component';
import { AdminDashboardComponent } from './admin-layout/admin.dashboard.component';
import { AdminFloorsAndRoomsComponent } from './admin-layout/room-manager/floors-and-rooms/admin.floors.and.rooms.component';
import { AdminHeaderComponent } from './admin-layout/admin-header/admin.header.component';
import { AdminLayoutComponent } from './admin-layout/admin.layout.component';
import { AdminMealPlanComponent } from './admin-layout/policy-manager/meal-plan/admin.meal.plan.component';
import { AdminNoShowPolicyComponent } from './admin-layout/policy-manager/no-show-policy/admin.no.show.policy.component';
import { AdminPaymentPolicyComponent } from './admin-layout/policy-manager/pament-policy/admin.payment.policy.component';
import { AdminPetPolicyComponent } from './admin-layout/policy-manager/pet-policy/admin.pet.policy.component';
import { AdminRatePlansComponent } from './admin-layout/price-manager/rate-plans/admin.rate.plans.component';
import { AdminRoomAmenitiesComponent } from './admin-layout/room-manager/room-amenities/admin.room.amenities.component';
import { AdminRoomTaxesComponent } from './admin-layout/room-manager/room-taxes/admin.room.taxes.component';
import { AdminRoomTypesComponent } from './admin-layout/room-manager/room-types/admin.room.types.component';
import { AdminRoomUnitComponent } from './admin-layout/room-manager/room-units/admin.room.unit.component';
import { AdminWebPolicyComponent } from './admin-layout/policy-manager/web-policy/admin.web.policy.component';
import { GeneralPropertyComponent } from './admin-layout/general-property/admin.general.property.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RoleGuard } from '../shared/guards/role.guard';
import { UserResolver } from '../shared/user.resolver.service';


export const adminRoutingComponent = [
  AdminCancellationPolicyComponent,
  AdminCheckinCheckoutPolicyComponent,
  AdminChildPolicyComponent,
  AdminDashboardComponent,
  AdminHeaderComponent,
  AdminFloorsAndRoomsComponent,
  AdminLayoutComponent,
  AdminMealPlanComponent,
  AdminNoShowPolicyComponent,
  AdminPaymentPolicyComponent,
  AdminPetPolicyComponent,
  AdminRatePlansComponent,
  AdminRoomAmenitiesComponent,
  AdminRoomTaxesComponent,
  AdminRoomTypesComponent,
  AdminRoomUnitComponent,
  AdminWebPolicyComponent,
  GeneralPropertyComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {
          path: 'admin',
          component: AdminLayoutComponent,
          resolve: {
            user: UserResolver
          },
          children: [
            {
              /* leading slash should not be given in the path */
              path: '',
              redirectTo: '/admin/dashboard', /* in redirectTo the leading slash is required */
              pathMatch: 'full',
              canActivate: [AuthGuard]
            },
            {
              path: 'dashboard',
              component: AdminDashboardComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'general',
              component: GeneralPropertyComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'amenities',
              component: AdminRoomAmenitiesComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'taxes',
              component: AdminRoomTaxesComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'roomtypes',
              component: AdminRoomTypesComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'floorsandrooms',
              component: AdminFloorsAndRoomsComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'roomunits',
              component: AdminRoomUnitComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'rateplans',
              component: AdminRatePlansComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'childpolicy',
              component: AdminChildPolicyComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'cancellationpolicy',
              component: AdminCancellationPolicyComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'checkincheckoutpolicy',
              component: AdminCheckinCheckoutPolicyComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'noshowpolicy',
              component: AdminNoShowPolicyComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'paymentpolicy',
              component: AdminPaymentPolicyComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'petpolicy',
              component: AdminPetPolicyComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'webpolicy',
              component: AdminWebPolicyComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'mealplan',
              component: AdminMealPlanComponent,
              canActivate: [AuthGuard]
            },

            /*{
              path: 'frontdesk',
              component: FrontdeskComponent,
              canActivate: [AuthGuard && RoleGuard],
              data:{
                moduleID: 1,
                moduleName: "FrontDesk"
              }
            },
            
            },*/

          ]
        },
      ]
    )
  ],
  exports: [CommonModule, RouterModule]
})
export class AdminRoutingModule { }
