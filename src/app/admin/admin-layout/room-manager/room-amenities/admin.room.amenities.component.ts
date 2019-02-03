import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';


import { AdminService } from '../../../services/admin.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';
import { IAminity } from './Aminities';

@Component({
  selector: 'app-admin-layout-room-amenities',
  templateUrl: './admin.room.amenities.component.html'
})
export class AdminRoomAmenitiesComponent implements OnInit {

  modalRef: BsModalRef;
  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  public type: string = 'component';
  public disabled: boolean = false;
  public config: PerfectScrollbarConfigInterface = {};
  public scrollBarContainerHeight: number;

  private aminityList: IAminity[];
  private showAddAminity: boolean = false;
  private newAminityName: string;
  private newAminityDesc: string;

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  //@ViewChild('childModal') childModal: ConfirmPopupComponent;

  constructor(
    private modalService: BsModalService,
    private _adminData: AdminService
  ) { }

  ngOnInit() {
    let headerBuffer = 60;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
    //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
    this.getAminittyList();
  }

  public getAminittyList() {
    this._adminData.getAllAmenities().subscribe(aminityRes => {
      console.log("aminityList: ", aminityRes);
      this.aminityList = aminityRes;
    });
  }

  public toggleType(): void {
    this.type = (this.type === 'component') ? 'directive' : 'component';
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  public scrollToXY(x: number, y: number): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollTo(x, y, 500);
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollTo(x, y, 500);
    }
  }

  public scrollToTop(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToTop();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToTop();
    }
  }

  public scrollToLeft(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToLeft();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToLeft();
    }
  }

  public scrollToRight(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToRight();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToRight();
    }
  }

  public scrollToBottom(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToBottom();
    } else if (this.type === 'component' && this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }

  public onScrollEvent(event: any): void {
    //console.log(event);
  }

  public addAminity() {
    this.showAddAminity = !this.showAddAminity;
    this.componentRef.directiveRef.scrollToBottom(-40, 300);
  }

  private createAminity() {

    let createAmimnityObject = {
      'aminity': [
        {
          "aminityName": this.newAminityName,
          "aminityDesc": this.newAminityDesc,
          "aminityType": ""
        }
      ]
    };

    this._adminData.createAminity(createAmimnityObject).subscribe(res => {
      this.alertMessageDetails.response = true;

      if (res['message'].toLowerCase() == 'success') {
        this.newAminityName = '';
        this.newAminityDesc = '';
        this.showAddAminity = false;
        this.getAminittyList();
        this.alertMessageDetails.type = 'success';
        this.alertMessageDetails.message = "New amenity created successfully";
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Amenity details creation failed! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    })
  }

  private editAminity(indx) {
    let updateAmimnityObject = {
      'aminity': [
        {
          "aminityName": this.aminityList[indx].aminityName,
          "aminityDesc": this.aminityList[indx].aminityDesc,
          "aminityID": this.aminityList[indx].aminityID,
        }
      ]
    };

    this._adminData.updateAminity(updateAmimnityObject).subscribe(res => {
      this.alertMessageDetails.response = true;

      if (res['message'].toLowerCase() == 'success') {
            this.alertMessageDetails.type = 'success';
            this.alertMessageDetails.message = "Amenity updated successfully";
      } else {
        this.alertMessageDetails.type = 'danger';
        this.alertMessageDetails.message = "Amenity details not updated! Please try again.";
      }

      setTimeout(() => {
        this.alertMessageDetails.response = false;
      }, 5000);
    });
  }

  openConfirmModal(indx: number) {
    this.modalRef = this.modalService.show(ConfirmPopupComponent);
    this.modalRef.content.title = 'Are you sure to delete?';
    this.modalRef.content.event.subscribe(data => {
      this.modalRef.hide();
      if (data.confirm == true) {
        this._adminData.removeAminity({
          aminityId: this.aminityList[indx].aminityID
        }).subscribe(res => {
          this.alertMessageDetails.response = true;
          if (res['message'].toLowerCase() == 'success') {
            this.aminityList.splice(indx, 1);
            this.alertMessageDetails.type = 'success';
            this.alertMessageDetails.message = "Amenity deleted successfully";
          } else {
            this.alertMessageDetails.type = 'danger';
            this.alertMessageDetails.message = "Amenity details not deleted! Please try again.";
          }

          setTimeout(() => {
            this.alertMessageDetails.response = false;
          }, 5000);
        });
      } else {
        console.log('dont go for delete: ', this.aminityList[indx]);
      }
    });
  }

}