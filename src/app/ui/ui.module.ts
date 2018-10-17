import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UiRoutingModule, uiRoutingComponent } from './ui.routing.module';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  imports: [
    CommonModule,
    UiRoutingModule
  ],
  declarations: [HeaderComponent, FooterComponent, LayoutComponent, uiRoutingComponent],
  exports: [LayoutComponent]
})
export class UiModule { }
