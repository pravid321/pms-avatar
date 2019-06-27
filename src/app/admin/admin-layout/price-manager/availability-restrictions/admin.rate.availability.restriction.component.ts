import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminAvailAndRestrictService } from './admin.avail.and.resrtict.service';
import { IRatePlan } from '../../../../ui/frontdesk/Frontdesk';
import { IRoomType } from '../../room-manager/room-types/RoomTypes';

import moment from 'moment';
import _ from 'underscore';

@Component({
    selector: 'app-admin-layout-rate-availability-restriction',
    templateUrl: './admin.rate.availability.restriction.component.html',
    styles: [
        '::ng-deep.bs-datepicker { left: 100px; top: 5px; }'
    ]
})
export class AdminRateAvailabilityComponent implements OnInit {

    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;
    @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

    rateUpdateConfigStart: Partial<BsDatepickerConfig>;
    rateUpdateConfigEnd: Partial<BsDatepickerConfig>;

    public rateUpdateDatePickerStart: any;
    public rateUpdateDatePickerEnd: any;
    public seletedCalDays: number;
    public rateUpdateDateList: any = [];
    public dayCellPercentage: number;
    public ratePlanList: IRatePlan[];
    public roomTypeList: IRoomType[];
    public ratePlanRoomTypeMapping: any[];
    public mappedRoomList: IRoomType[]; // this variable for mapping the room list on rate plan selection
    public selectedRatePlan: IRatePlan;
    public selectedRoomCount: number;
    public selectedOptions: string;

    constructor(private _adminData: AdminAvailAndRestrictService) { }

    ngOnInit() {

        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);

        this.selectedRoomCount = 0;
        this.selectedOptions = 'MLOS';
        this._adminData.getAvailAndRestrictData().subscribe(availRestrictRes => {
            this.ratePlanList = availRestrictRes[0];
            this.roomTypeList = availRestrictRes[1];
            this.ratePlanRoomTypeMapping = availRestrictRes[2];
            this.selectedRatePlan = null;
        });

        this.rateUpdateConfigStart = Object.assign({}, {
            containerClass: 'theme-blue',
            dateInputFormat: 'DD-MMM-YYYY',
            minDate: new Date(),
            showWeekNumbers: false
        });

        this.rateUpdateConfigEnd = Object.assign({}, {
            containerClass: 'theme-blue',
            dateInputFormat: 'DD-MMM-YYYY',
            minDate: new Date(),
            showWeekNumbers: false
        });

        this.rateUpdateDatePickerStart = moment().format('DD-MMM-YYYY');
        this.rateUpdateDatePickerEnd = moment().add(6, 'days').format('DD-MMM-YYYY');
        this.onRateUpdateDateChangeCalculateChart();



    }

    public onRateUpdateDateChangeCalculateChart(value?: Date) {
        this.rateUpdateDateList = [];
        this.seletedCalDays = moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').diff(moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY'), 'days') + 1;
        let startDate = moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').clone();
        while (moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').diff(moment(startDate, 'DD-MMM-YYYY')) >= 0) {
            //console.log( moment(startDate, 'DD-MMM-YYYY').format('DD-MMM-YYYY'), moment(startDate, 'DD-MMM-YYYY').format('DD-MMM-YYYY') == moment(this.tcDatePickerEnd, 'DD-MMM-YYYY').format('DD-MMM-YYYY'));
            this.rateUpdateDateList.push(startDate.toDate());
            startDate = startDate.add(1, 'days');
        }
        this.dayCellPercentage = 82 / this.seletedCalDays;
        //console.log("after while: ", this.tariffChartDateList);
    }

    public getMappedRoom(ratePlanItem: IRatePlan) {
        let self = this;
        this.selectedRatePlan = ratePlanItem;
        this.mappedRoomList = [];
        this.roomTypeList.map(roomTypeItem => {
            //console.log("in rate plan list map: ", roomTypeItem.roomID, ratePlanItem.ratePlanCode, typeof (_.findWhere(self.ratePlanRoomTypeMapping, { roomId: roomTypeItem.roomID, rateCode: ratePlanItem.ratePlanCode })) !== 'undefined');
            let ratePlanRoomTypeMappingObj = _.findWhere(self.ratePlanRoomTypeMapping, { roomId: roomTypeItem.roomID, rateCode: ratePlanItem.ratePlanCode });
            if(typeof (ratePlanRoomTypeMappingObj) !== 'undefined'){
                roomTypeItem['checked'] = false;
                this.mappedRoomList.push(roomTypeItem)
            }            
        });
        this.selectedRoomCount = 0;
        //console.log("after the mapped object: ", this.mappedRoomList);
    }

    roomSelectionForUpdate() {
        this.selectedRoomCount = _.size(this.mappedRoomList.filter(mappedRoomItem => mappedRoomItem.checked));
    }
}
