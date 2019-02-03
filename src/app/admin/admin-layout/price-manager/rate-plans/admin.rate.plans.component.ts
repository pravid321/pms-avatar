import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminService } from '../../../services/admin.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';

@Component({
  selector: 'app-admin-layout-rate-plans',
  templateUrl: './admin.rate.plans.component.html',
  styles: [
    `:host >>> .popover {
      max-width:500px;
    }`
  ]
})
export class AdminRatePlansComponent implements OnInit {

  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };
  
  policyList: any;
  public ratePlanList: any;
  public allCkbox: boolean;
  public allRatePlanCkbox: boolean;

  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminService
  ) { }

  ngOnInit() {
    let headerBuffer = 60;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
    //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
    this.getRatePlanList();
    this.policyList = [
      {
        policyId: 1,
        name: 'Child Policy',
        checked: false,
      },
      {
        policyId: 2,
        name: 'Pet Policy',
        checked: false,
      },
      {
        policyId: 3,
        name: 'Check In & Check Out Policy',
        checked: false,
      },
      {
        policyId: 4,
        name: 'Cancellation',
        checked: false,
      },
      {
        policyId: 5,
        name: 'No Show',
        checked: false,
      }
    ]
  }

  public getRatePlanList() {
    this.ratePlanList = [
      {
        ratePlanId: 1,
        editable: false,
        checked: false,
        name: 'Bar',
        description: 'describe rate plan',
        code: 'CODE',
        weightage: 10,
        weightPer: true
      },
      {
        ratePlanId: 2,
        editable: false,
        checked: false,
        name: 'DLX',
        description: 'describe rate plan',
        code: 'CODE',
        weightage: 40,
        weightPer: false
      },
      {
        ratePlanId: 3,
        editable: false,
        checked: false,
        name: 'ADV',
        description: 'describe rate plan for big date it will cause next line',
        code: 'CODE',
        weightage: 49,
        weightPer: false
      }
    ];
  }

  public editRate() {

  }

  public mapPolicies(ratePlanObj){
    console.log("on popover: ", ratePlanObj);    
  }

  public selectCKBStatus(ckBoxType: any) {
    if (ckBoxType == 'all') {
      for (let i = 0; i < this.policyList.length; i++) {
        this.policyList[i].checked = this.allCkbox;
      }
    } else {
      this.allCkbox = this.policyList.every(policyItem => policyItem.checked);
    }
  }

  public selectRatePlanCKBStatus(ckBoxType: any) {
    if (ckBoxType == 'all') {
      for (let i = 0; i < this.ratePlanList.length; i++) {
        this.ratePlanList[i].checked = this.allRatePlanCkbox;
      }
    } else {
      this.allRatePlanCkbox = this.ratePlanList.every(ratePlanItem => ratePlanItem.checked);
    }
  }

  public addRatePlan() {

  }
  
}