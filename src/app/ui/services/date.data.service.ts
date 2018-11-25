import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateDataService {
    fromDate: NgbDate;
    toDate: NgbDate;

    constructor() {}

    private startDate = new BehaviorSubject(this.fromDate);
    private endDate = new BehaviorSubject(this.toDate);

    currentStartDate = this.startDate.asObservable();
    currentEndDate = this.endDate.asObservable();

    changeStartDate(frmDate: NgbDate) {
        this.startDate.next(frmDate);
    }

    changeEndDate(endDate: NgbDate) {
        this.endDate.next(endDate);
    }

}