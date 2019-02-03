import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminService } from '../../services/admin.service';
import { ConfirmPopupComponent } from '../../../shared/components/confirm.popup.component';

@Component({
    templateUrl: './admin.general.property.component.html',
    styleUrls: ['./admin.general.property.component.scss']
  })
  export class GeneralPropertyComponent  {
  }