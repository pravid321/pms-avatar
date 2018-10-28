import { Component } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DateDataService } from "../services/date.data.service";
import { log } from 'util';

@Component({
    selector: 'ngbd-datepicker-range',
    templateUrl: './datepicker.range.component.html',
    styles: [`
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `]
})
export class NgbdDatepickerRange {

    hoveredDate: NgbDate;

    fromDate: NgbDate;
    toDate: NgbDate;

    constructor(calendar: NgbCalendar, private dateData: DateDataService) {
        this.fromDate = calendar.getToday();
        this.dateData.changeStartDate(calendar.getToday());
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 14);
        this.dateData.changeEndDate(calendar.getNext(calendar.getToday(), 'd', 14));
     }

    ngOnInit() {
        //this.dateData.currentStartDate.subscribe(stDate => this.fromDate = stDate);
        //this.dateData.currentEndDate.subscribe(edDate => this.toDate = edDate);

        //console.log("in in it: ", this.fromDate, this.toDate);
        
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
            this.dateData.changeStartDate(date);
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
            this.dateData.changeEndDate(date);
        } else {
            this.toDate = null;
            this.fromDate = date;
            this.dateData.changeStartDate(date);
        }
    }

    isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate) {
        return date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate) {
        return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
    }
}
