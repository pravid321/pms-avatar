import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { DayPilotModule } from 'daypilot-pro-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UiRoutingModule, uiRoutingComponent } from './ui.routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SchedulerComponent, schedulerSupportComponent } from './scheduler/scheduler.component';
import { NgbdDatepickerRange } from './datepicker/datepicker.range.component';
import { DataService } from './scheduler/data.service';
import { DateDataService } from './services/date.data.service';
import { FrontDeskService } from './services/front.desk.services';
import { UserDataService } from './services/user.data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    UiRoutingModule,
    DayPilotModule
  ],
  declarations: [HeaderComponent, FooterComponent, LayoutComponent, uiRoutingComponent, SchedulerComponent, NgbdDatepickerRange, schedulerSupportComponent],
  exports: [LayoutComponent, SchedulerComponent],
  providers:    [ DataService, DateDataService, FrontDeskService, UserDataService ]
})
export class UiModule { }
