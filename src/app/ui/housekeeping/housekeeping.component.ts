import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';

import moment from 'moment';
import _ from 'lodash';

import { IHKRoom } from './Housekeeping';
import { HousekeepingService } from '../services/housekeeping.services';
import { RouteParameterService } from '../../shared/route.parameter.service';

@Component({
  selector: 'app-ui-housekeeping',
  templateUrl: './housekeeping.component.html'
})
export class HousekeepingComponent implements OnInit{

  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  public config: PerfectScrollbarConfigInterface = {};
  scrollBarContainerHeight: number = 0;

  alertMessageDetails = {
    response: false,
    type: null,
    message: null
  };

  public modalRef: BsModalRef;
  public bsConfigStart: Partial<BsDatepickerConfig>;
  public bsConfigEnd: Partial<BsDatepickerConfig>;
  public rawHouseKeepingData: IHKRoom[] = null;
  public houseKeepingData: IHKRoom[] = null;
  public hotelEmployeeData: any = null;
  public allCkbox: boolean;
  public topRoomStatus: string;
  public selectedRoomTypeValue: string;
  public bulkAssignedEmployee: string;
  public updateHkObject: any;
  public roomTypeList: any

  public bsValueStart: Date;
  public bsValueEnd: Date;
  public newHkRemarks: string;
  public newHkStatus: string;

  constructor(
    private housekeepingService: HousekeepingService,
    private modalService: BsModalService,
    private router: Router,
    private routeParamService: RouteParameterService) {
    this.bsConfigStart = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      minDate: new Date(),
      showWeekNumbers: false
    });

    this.bsConfigEnd = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      minDate: new Date(),
      showWeekNumbers: false
    });
  }

  ngOnInit() {
    this.routeParamService.changeRoute({
      url: this.router.url,
      pageName: 'Housekeeping'
    });
    this.allCkbox = false;
    let buffer = 75;
    this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $(".head-section").outerHeight() + $(".body-section").outerHeight() + $("#uiFooter").outerHeight() + buffer);
    //console.log("in ng component: ", $(document).height(), $("#main-navbar").outerHeight() , $("#sub-navbar").outerHeight() , $(".head-section").outerHeight() , $(".body-section").outerHeight(),  $("#uiFooter").outerHeight(), this.scrollBarContainerHeight);

    this.bulkAssignedEmployee = 'Select';
    this.topRoomStatus = 'Select';
    this.selectedRoomTypeValue = 'All Room Types';
    this.housekeepingService.getHousekeepingDetails().subscribe(res => {
      this.rawHouseKeepingData = res;
      this.roomTypeList = _.uniq(res.map(({ roomCode }) => roomCode));
      //console.log("housekeeping data: ", this.houseKeepingData, this.roomTypeList);
      this.selectedRoomType('All Room Types');
    });

    this.housekeepingService.getAllHousekeepingEmployeeList().subscribe(res => {
      this.hotelEmployeeData = res['employees'];
    });    

    /*this.housekeepingService.getAllHotelEmployeeList().subscribe(res => {      
      console.log("employee list: ", this.hotelEmployeeData);
    });*/

  }

  public selectCKBStatus(ckBoxType: any) {
    if (ckBoxType == 'all') {
      for (let i = 0; i < this.houseKeepingData.length; i++) {
        this.houseKeepingData[i].checked = this.allCkbox;
      }
    } else {
      this.allCkbox = this.houseKeepingData.every(hkItem => hkItem.checked);
    }
  }

  public selectedRoomType(roomType: string) {
    this.selectedRoomTypeValue = roomType;
    this.houseKeepingData = (roomType == 'All Room Types') ? JSON.parse(JSON.stringify(this.rawHouseKeepingData)) : this.rawHouseKeepingData.filter((hkItem:IHKRoom) => { return hkItem.roomCode == roomType });
  }

  public isAnyRoomSelected() {    
    if(this.houseKeepingData != null){
      return this.houseKeepingData.some(hkItem => hkItem.checked)
    }
  }

  public updateStatus(roomObj, type: string, objectValue: string, template: TemplateRef<any>) {

    this.updateHkObject = { "hkRoomUnits": [] };

    if (type == 'roomStatus' && roomObj.roomStatus != objectValue) {

      this.updateHkObject.hkRoomUnits.push(roomObj);
      if (objectValue == "Inspect" || objectValue == "Out of order") {

        this.modalRef = this.modalService.show(
          template,
          Object.assign({}, { class: 'gray modal-md' })
        );
        this.newHkStatus = objectValue;

      } else {

        this.updateHkObject['hkRoomUnits'].map((updateHkItem: any) => {
          updateHkItem.roomStatus = objectValue;
          updateHkItem.remarks = null;
          updateHkItem.sartDate = null;
          updateHkItem.enddate = null;
          delete updateHkItem.checked;
        });
        this.changeRoomStatus('updated');
      }

    } else if (type == 'staff' && roomObj.assignedHouseStaf != objectValue) {

      this.updateHkObject.hkRoomUnits.push(roomObj);
      this.updateHkObject['hkRoomUnits'].map((updateHkItem: any) => {
        updateHkItem.assignedHouseStaf = objectValue;
      });
      this.changeRoomStatus('updated');
    }

  }

  public changeRoomStatus(type: string) {
    if (type === 'update') {
      this.modalRef.hide();
      //console.log("in change room status: ", this.bsValueStart,      this.bsValueEnd);
      this.updateHkObject['hkRoomUnits'].map((updateHkItem: any) => {
        updateHkItem.roomStatus = this.newHkStatus;
        updateHkItem.remarks = this.newHkRemarks;
        updateHkItem.sartDate = moment(this.bsValueStart).format("YYYY-MM-DD");
        updateHkItem.enddate = moment(this.bsValueEnd).format("YYYY-MM-DD");
        delete updateHkItem.checked;
      });
    }
    
    this.housekeepingService.updateHousekeepingDetails(this.updateHkObject).subscribe(res => {
      this.topRoomStatus = 'Select';
      this.showUpdateResponse(res);
    });
  }

  public updateTopRoomStatus(roomStatus: string, template: TemplateRef<any>) {
    
    this.topRoomStatus = roomStatus;

    if (roomStatus == "Inspect" || roomStatus == "Out of order") {
      
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: 'gray modal-md' })
      );
      this.newHkStatus = roomStatus;
      this.updateHkObject = { "hkRoomUnits": [] };

      this.houseKeepingData.map((hkItem: any) => {
        if (hkItem.checked) {
          this.updateHkObject['hkRoomUnits'].push(hkItem);
        }
      });
    }
  }

  public setHkStatus() {
    this.updateHkObject = { "hkRoomUnits": [] };

    this.houseKeepingData.map((hkItem: any) => {
      if (hkItem.checked) {
        hkItem.roomStatus = this.topRoomStatus;
        this.updateHkObject['hkRoomUnits'].push(hkItem);
      }
    });

    this.housekeepingService.updateHousekeepingDetails(this.updateHkObject).subscribe(res => {
      console.log("response: ", res);
      this.topRoomStatus = 'Select';      
      this.showUpdateResponse(res);
    });
  }

  public assignEmployee() {
    this.updateHkObject = { "hkRoomUnits": [] };

    this.houseKeepingData.map((hkItem: any) => {
      if (hkItem.checked) {
        hkItem.assignedHouseStaf = this.bulkAssignedEmployee;
        this.updateHkObject['hkRoomUnits'].push(hkItem)
      }
    });

    this.housekeepingService.updateHousekeepingDetails(this.updateHkObject).subscribe(res => {
      //console.log("response: ", res);
      this.bulkAssignedEmployee = 'Select';
      this.showUpdateResponse(res);
    });
  }

  public showUpdateResponse(res) {

    this.houseKeepingData.map((hkItem: any) => {
      hkItem.checked = false;
    });
    this.allCkbox = false;
    this.alertMessageDetails.response = true;
    
    if (res['message'].toLowerCase() == 'success') {
      this.alertMessageDetails.type = 'success';
      this.alertMessageDetails.message = "House keeping data updated successfully";
    } else {
      this.alertMessageDetails.type = 'danger';
      this.alertMessageDetails.message = "House keeping data updation failed! Please try again.";
    }

    setTimeout(() => {
      this.alertMessageDetails.response = false;
    }, 5000);
  }

}
