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
import { AdminPhoneExtensionComponent } from './admin-layout/room-manager/phone-extension/admin.phone.extension.component';
import { AdminRateAvailabilityComponent } from './admin-layout/price-manager/availability-restrictions/admin.rate.availability.restriction.component';
import { AdminRatePlansComponent } from './admin-layout/price-manager/rate-plans/admin.rate.plans.component';
import { AdminRateUpdateComponent } from './admin-layout/price-manager/rate-update/admin.rate.update.component';
import { AdminReportsEmailSetupComponent } from './admin-layout/admin-reports/email-setup/admin.reports.email.setup.component';
import { AdminReportsScheduleReportComponent } from './admin-layout/admin-reports/schedule-report/admin.reports.schedule.report.component';
import { AdminRoomAmenitiesComponent } from './admin-layout/room-manager/room-amenities/admin.room.amenities.component';
import { AdminRoomTaxesComponent } from './admin-layout/room-manager/room-taxes/admin.room.taxes.component';
import { AdminRoomTypesComponent } from './admin-layout/room-manager/room-types/admin.room.types.component';
import { AdminRoomUnitComponent } from './admin-layout/room-manager/room-units/admin.room.unit.component';
import { AdminUserCreationLayoutComponent, userManagerComponents } from './admin-layout/user-manager/user.creation.layout.component';
import { AdminUserListComponent } from './admin-layout/user-manager/user-list/admin.user.list.component';
import { AdminWebPolicyComponent } from './admin-layout/policy-manager/web-policy/admin.web.policy.component';
import { GeneralPropertyComponent } from './admin-layout/general-property/admin.general.property.component';
import { HQAccountManagerComponent } from './admin-layout/hq-account-manager/admin.hqaccount.manager.component';
import { HQFundManagerComponent } from './admin-layout/hq-fund-manager/admin.hqfund.manager.component';
import { ManageDepartmentComponent } from './admin-layout/manage-department/admin.manage.department.component';

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
  AdminPhoneExtensionComponent,
  AdminRateAvailabilityComponent,
  AdminRatePlansComponent,
  AdminRateUpdateComponent,
  AdminReportsEmailSetupComponent,
  AdminReportsScheduleReportComponent,
  AdminRoomAmenitiesComponent,
  AdminRoomTaxesComponent,
  AdminRoomTypesComponent,
  AdminRoomUnitComponent,
  AdminUserCreationLayoutComponent,
  AdminUserListComponent,
  AdminWebPolicyComponent,
  GeneralPropertyComponent,
  HQAccountManagerComponent,
  HQFundManagerComponent,
  ManageDepartmentComponent,
  userManagerComponents,
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
              //redirectTo: '/admin/dashboard', /* in redirectTo the leading slash is required */
              redirectTo: '/admin/general', /* in redirectTo the leading slash is required */
              pathMatch: 'full',
              canActivate: [AuthGuard && RoleGuard],
              data: {
                moduleID: 9,
                moduleName: "Admin"
              }
            },
            {
              path: 'dashboard',
              component: AdminDashboardComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: {
                moduleID: 9,
                moduleName: "Admin"
              }
            },
            {
              path: 'general',
              component: GeneralPropertyComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: {
                moduleID: 9,
                moduleName: "Admin"
              }
            },
            {
              path: 'departments',
              component: ManageDepartmentComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'amenities',
              component: AdminRoomAmenitiesComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'taxes',
              component: AdminRoomTaxesComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'roomtypes',
              component: AdminRoomTypesComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'floorsandrooms',
              component: AdminFloorsAndRoomsComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'roomunits',
              component: AdminRoomUnitComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'rateplans',
              component: AdminRatePlansComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'rateupdate',
              component: AdminRateUpdateComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'rateavalabilityandrestriction',
              component: AdminRateAvailabilityComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'childpolicy',
              component: AdminChildPolicyComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'cancellationpolicy',
              component: AdminCancellationPolicyComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'checkincheckoutpolicy',
              component: AdminCheckinCheckoutPolicyComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'noshowpolicy',
              component: AdminNoShowPolicyComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'paymentpolicy',
              component: AdminPaymentPolicyComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'petpolicy',
              component: AdminPetPolicyComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'webpolicy',
              component: AdminWebPolicyComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'mealplan',
              component: AdminMealPlanComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'phoneextension',
              component: AdminPhoneExtensionComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'createuser',
              component: AdminUserCreationLayoutComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'userlist',
              component: AdminUserListComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'emailsetup',
              component: AdminReportsEmailSetupComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'schedulereport',
              component: AdminReportsScheduleReportComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'hqaccountmanager',
              component: HQAccountManagerComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
            {
              path: 'hqfundmanager',
              component: HQFundManagerComponent,
              canActivate: [AuthGuard && RoleGuard],
              data: { moduleID: 9, moduleName: "Admin" }
            },
          ]
        },
      ]
    )
  ],
  exports: [CommonModule, RouterModule]
})
export class AdminRoutingModule { }
