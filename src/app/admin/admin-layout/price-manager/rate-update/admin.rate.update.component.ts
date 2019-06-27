import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminRateUpdateService } from './admin.rate.update.service';
import { IRatePlan } from '../rate-plans/RatePlan';
import { IRoomType } from '../../room-manager/room-types/RoomTypes';

import moment from 'moment';
import _ from 'underscore';

@Component({
    selector: 'app-admin-layout-rate-update',
    templateUrl: './admin.rate.update.component.html',
    styles: [
        '::ng-deep.bs-datepicker { left: 100px; top: 5px; }'
    ]
})
export class AdminRateUpdateComponent implements OnInit {

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

    public ratePlanList: IRatePlan[];
    public roomTypeList: IRoomType[];
    public rateUpdateDatePickerStart: any;
    public rateUpdateDatePickerEnd: any;
    public seletedCalDays: number;
    public rateUpdateDateList: any = [];
    public ratePriceDateList: any = [];
    public dayCellPercentage: number;
    public selectedRatePlan: {
        id: number,
        name: string
    };

    objectKeys = Object.keys;

    constructor(private _adminData: AdminRateUpdateService) { }

    ngOnInit() {

        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);

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

        this.selectedRatePlan = { id: 0, name: "Select"};
        this.onRateUpdateDateChangeCalculateChart();
        
        this._adminData.getDataList('Rateplans/getRateplans/', 'ratePlans', false).subscribe(ratePlanListRes => {
            this.ratePlanList = ratePlanListRes;
        });
        this._adminData.getDataList('Rooms/getRoomTypes/', 'roomTypes', false).subscribe(roomTypeListRes => {
            this.roomTypeList = roomTypeListRes;
        });
    }
    
    public getPriceManagerRates(rateItem: IRatePlan) {
        //console.log("rate Item: ", this.roomTypeList, _.findWhere(this.roomTypeList, {roomID: 1}));
        this.ratePriceDateList = {};

        this.selectedRatePlan = {id: rateItem.ratePlanID, name: rateItem.ratePlanName};
        let requestObj = {
            rateplanID: rateItem.ratePlanID,
            checkinDate: moment(this.rateUpdateDatePickerStart, 'DD-MMM-YYYY').format('YYYY-MM-DD'),
            checkoutDate: moment(this.rateUpdateDatePickerEnd, 'DD-MMM-YYYY').add(1, 'days').format('YYYY-MM-DD')
        }
        this._adminData.getData('PriceManager/getPriceManagerRates/',requestObj).subscribe(updatePriceRes => {
            this.ratePriceDateList = _.groupBy(updatePriceRes.roomRate, 'roomID');
            for( let key in this.ratePriceDateList) {
                let room_id: any = key;
                this.ratePriceDateList[key]['roomName'] = _.findWhere(this.roomTypeList, {roomID: room_id*1}).roomName;
            }
            //console.log("response: ", updatePriceRes, this.ratePriceDateList);
        });
    }

    public onRateUpdateDateChangeCalculateChart(value?: Date) {
        let self = this;
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

        if(this.selectedRatePlan.name != 'Select'){
            this.getPriceManagerRates(_.findWhere(self.ratePlanList, {ratePlanID: self.selectedRatePlan.id}))
        }
    }
}
