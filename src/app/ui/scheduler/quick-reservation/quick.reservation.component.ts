import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { DayPilot, DayPilotModalComponent } from "daypilot-pro-angular";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DataService, CreateEventParams } from "../data.service";
import { IRatePlan } from '../../frontdesk/Frontdesk';

import * as moment from 'moment';

@Component({
  selector: 'create-dialog',
  templateUrl: './quick.reservation.component.html',
  styleUrls: ['./quick.reservation.component.scss']  
})
export class QuickReservationComponent {

  @ViewChild("modal") modal : DayPilotModalComponent;
  @Output() close = new EventEmitter();

  @Input() ratePlanList: IRatePlan;

  form: FormGroup;
  dateFormat = "dd-MMM-yyyy";

  resources: any[];

  constructor(private fb: FormBuilder, private ds: DataService) {
    this.form = this.fb.group({
      fname: [""],
      lname: [""],
      rateType: [""],
      start: ["", this.dateTimeValidator(this.dateFormat)],
      end: ["", [Validators.required, this.dateTimeValidator(this.dateFormat)]],
      resource: ["", Validators.required]
    });

    this.ds.getResources().subscribe(result => this.resources = result);    
  }

  show(args: any) {
    console.log("on show: ", args, this.ratePlanList, moment(args.end.toString(this.dateFormat), 'DD-MMM-YYYY').subtract(1, 'd').format("DD-MM-YYYY"));
    this.form.setValue({
      start: args.start.toString(this.dateFormat),
      end: moment(args.end.toString(this.dateFormat), 'DD-MMM-YYYY').subtract(1, 'd').format("DD-MMM-YYYY"),
      rateType: "slcRate",
      fname:"",
      lname: "",
      resource: args.resource
    });
    this.modal.show();
  }

  submit() {
    let data = this.form.getRawValue();

    let params: CreateEventParams = {
      start: DayPilot.Date.parse(data.start, this.dateFormat).toString(),
      end: DayPilot.Date.parse(data.end, this.dateFormat).toString(),
      text: data.name,
      resource: data.resource
    };

    this.ds.createEvent(params).subscribe(result => {
      this.modal.hide(result);
    });
  }

  cancel() {
    this.modal.hide();
  }

  closed(args) {
    this.close.emit(args);
  }

  dateTimeValidator(format: string) {
    return function(c:FormControl) {
      let valid = !!DayPilot.Date.parse(c.value, format);
      return valid ? null : {badDateTimeFormat: true};
    };
  }
}
