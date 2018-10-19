import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayPilotModule } from 'daypilot-pro-angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UiRoutingModule, uiRoutingComponent } from './ui.routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { DataService } from './scheduler/data.service';

@NgModule({
  imports: [
    CommonModule,
    UiRoutingModule,
    DayPilotModule
  ],
  declarations: [HeaderComponent, FooterComponent, LayoutComponent, uiRoutingComponent, SchedulerComponent],
  exports: [LayoutComponent, SchedulerComponent],
  providers:    [ DataService ]
})
export class UiModule { }
