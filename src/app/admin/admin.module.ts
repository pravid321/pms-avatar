
import { AdminService } from './services/admin.service';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MultiselectModule } from 'ngx-multiselect'; // not using
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { NgModule, TemplateRef } from '@angular/core';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { AdminRoutingModule, adminRoutingComponent } from './admin.routing.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  wheelSpeed: 15
};

@NgModule({
  imports: [
    AdminRoutingModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule.forRoot(), 
    MultiselectModule.forRoot(),// not using
    MultiselectDropdownModule,
    PerfectScrollbarModule,
    PopoverModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [ 
    adminRoutingComponent
   ],
  providers: [
    AdminService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class AdminModule { }
