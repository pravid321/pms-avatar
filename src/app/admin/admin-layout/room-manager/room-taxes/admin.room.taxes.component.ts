import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminService } from '../../../services/admin.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { ITax } from './Taxes';

@Component({
  selector: 'app-admin-layout-room-taxes',
  templateUrl: './admin.room.taxes.component.html'
})
export class AdminRoomTaxesComponent implements OnInit {

  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  public taxList: ITax[];
  public showAddTax: boolean = false;

  public newTaxCode: string;
  public newTaxDescription: string;
  public newTaxAmount: number;
  public newapplicationLabel: string;
  public newTaxPercent: boolean = false;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminService
  ) { }

  ngOnInit() {
    let headerBuffer = 60;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
    //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
    this.getTaxesList();
  }

  public getTaxesList() {
    this._adminData.getTaxesList().subscribe(taxRes => {
      this.taxList = taxRes;
      console.log("in get tax list: ", this.taxList);

    });
  }

  public toggleCreateTax() {
    this.showAddTax = !this.showAddTax;
    this.componentRef.directiveRef.scrollToBottom(-45, 300);
  }

  public createTax() {

    let createTaxObject = {
      'taxes': [
        {
          "taxCode": this.newTaxCode,
          "taxDescription": this.newTaxDescription,
          "taxAmount": this.newTaxAmount,
          "applicationLevel": this.newapplicationLabel,
          "percent": this.newTaxPercent
        }
      ]
    };

    this._adminData.createTax(createTaxObject).subscribe(res => {
      this.alertMessageDetails.response = true;

      if (res['message'].toLowerCase() == 'success') {
        this.newTaxCode = '';
        this.newTaxDescription = '';
        this.newTaxAmount = null;
        this.newapplicationLabel = '';
        this.newTaxPercent = false;
        this.showAddTax = false;
        this.getTaxesList();
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = "New tax created successfully";
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Tax details creation failed! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    })
  }

  public editTax(indx) {
    let updateTaxObject = {
      "taxes": [{
        "taxId": this.taxList[indx].taxId,
        "taxCode": this.taxList[indx].taxCode,
        "taxDescription": this.taxList[indx].taxDescription,
        "taxAmount": this.taxList[indx].taxAmount,
        "applicationLevel": this.taxList[indx].applicationLevel,
        "percent": this.taxList[indx].percent
      }]
    };

    this._adminData.updateTaxDetails(updateTaxObject).subscribe(res => {
      this.alertMessageDetails.response = true;

      if (res['message'].toLowerCase() == 'success') {
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = "Tax updated successfully";
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Tax details not updated! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    });
  }

  public openConfirmModal(indx: number) {
    this.modalRef = this.modalService.show(ConfirmPopupComponent);
    this.modalRef.content.title = 'Are you sure to delete?';
    this.modalRef.content.event.subscribe(data => {
      this.modalRef.hide();
      if (data.confirm == true) {
        this._adminData.removeTax(this.taxList[indx].taxId).subscribe(res => {
          this.alertMessageDetails.response = true;
          if (res['message'].toLowerCase() == 'success') {
            this.taxList.splice(indx, 1);
            this.alertMessageDetails.type = 'success';
            this.alertMessageDetails.message = "Tax deleted successfully";
          } else {
            this.alertMessageDetails.type = 'danger';
            this.alertMessageDetails.message = "Tax details not deleted! Please try again.";
          }

          setTimeout(() => {
            this.alertMessageDetails.response = false;
          }, 5000);
        });
      } else {
        console.log('dont go for delete: ', this.taxList[indx]);
      }
    });
  }
}