import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

import moment from 'moment';

@Component({
  selector: 'app-ui-tariff-chart',
  templateUrl: './tariffchart.component.html',
  styles: [
    '::ng-deep.bs-datepicker { left: 100px; top: 5px; }'
  ]
})
export class TariffChartComponent implements OnInit {

  modalRef: BsModalRef;
  tariffChartConfigStart: Partial<BsDatepickerConfig>;
  tariffChartConfigEnd: Partial<BsDatepickerConfig>;

  public tcDatePickerStart: any;
  public tcDatePickerEnd: any;
  public seletedCalDays: number;
  public tariffChartDateList: any = [];
  public dayCellPercentage: number;
  public nightRateDays: number;
  public nightRateRows: any;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {

    this.tariffChartConfigStart = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      minDate: new Date(),
      showWeekNumbers: false
    });

    this.tariffChartConfigEnd = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      minDate: new Date(),
      showWeekNumbers: false
    });

    this.tcDatePickerStart = moment().format('DD-MMM-YYYY');
    this.tcDatePickerEnd = moment().add(6, 'days').format('DD-MMM-YYYY');
    this.calculateChart();
  }

  public onTariffChartDateChange(value: Date, type: string): void {
    //console.log("on change: ", this.tcDatePickerStart, this.tcDatePickerEnd, moment(this.tcDatePickerEnd, 'DD-MMM-YYYY').diff(moment(this.tcDatePickerStart, 'DD-MMM-YYYY'), 'days'), type);
    
    
    this.calculateChart();
    //this.tcDatePickerEnd, this.tcDatePickerStart 
  }

  public calculateChart() {
    this.tariffChartDateList = [];
    this.seletedCalDays = moment(this.tcDatePickerEnd, 'DD-MMM-YYYY').diff(moment(this.tcDatePickerStart, 'DD-MMM-YYYY'), 'days') + 1;
    let startDate = moment(this.tcDatePickerStart, 'DD-MMM-YYYY').clone();
    while(moment(this.tcDatePickerEnd, 'DD-MMM-YYYY').diff(moment(startDate, 'DD-MMM-YYYY')) >= 0) {
      //console.log( moment(startDate, 'DD-MMM-YYYY').format('DD-MMM-YYYY'), moment(startDate, 'DD-MMM-YYYY').format('DD-MMM-YYYY') == moment(this.tcDatePickerEnd, 'DD-MMM-YYYY').format('DD-MMM-YYYY'));
      this.tariffChartDateList.push(startDate.toDate());
      startDate = startDate.add(1, 'days');
    }
    this.dayCellPercentage = 82 / this.seletedCalDays;
    //console.log("after while: ", this.tariffChartDateList);
  }

  public getNightlyRate(template: TemplateRef<any>, rateData: any) {
    this.nightRateDays = 2;
    this.nightRateRows = Array(this.nightRateDays).fill(4).map((x,i)=>i);
    console.log("this.nightRateRows: ", this.nightRateRows);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
      );
    }
    
    public setNightRows(dayIndex: number) {
      this.nightRateDays = dayIndex;
      this.nightRateRows = Array(this.nightRateDays).fill(0).map((x,i)=>i);
  }
}
