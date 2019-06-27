import { Component, Input, OnInit, OnChanges, TemplateRef, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { CounterResolverService } from '../../shared/counter.resolver.service';
import { NightAuditService } from '../services/night.audit.services';
import { OpenCloseCashCounterService } from '../services/open.close.cash.counter.service';
import { UserResolver } from '../../shared/user.resolver.service';

import moment from 'moment';

@Component({
    selector: 'ui-night-audit',
    templateUrl: './night.audit.component.html'
})
export class NightAuditComponent implements OnInit {

    @Input() nightAuditPercent: number;
    @Output() closeNightAuditModal = new EventEmitter;

    private loggedUserData: any;
    public progressBarMax: number = 100;
    public nightAuditMessage: string;
    public apiStatusMessage: string;
    public nightAuditStatus: boolean;
    public loggedUserList: any;
    public dueInArrivalList: any;
    public allNoShowCkbox: boolean;
    public allNextDayArrivalCkbox: boolean;
    public dueOutDepartureList: any;
    public allCheckOutCkbox: boolean;
    public allExtendStayCkbox: boolean;

    public selectedCounter: any = {
        "counterId": "",
        "counterName": "Select Counter"
    };
    public counterList: any;
    public counterItem: any;
    public openingCashAmt: number = null;
    public disrepancyReason: string = null;

    constructor(
        private openCloseCashCounterService: OpenCloseCashCounterService,
        private _counterResolverService: CounterResolverService,
        private _http: HttpClient,
        private nightAuditService: NightAuditService,
        private _userResolver: UserResolver
    ) { }

    ngOnInit() {
        this.nightAuditPercent = 0;
        this.loggedUserData = this._userResolver.getUserData();
    }

    public startNightAudit() {
        this.nightAuditStatus = true;
        this.getLoggedUserDetails();
    }

    public prceedAudit() {
        switch (this.nightAuditPercent) {
            case 10:
                this.getOtherUserLoggedOut();
                break;
            case 30:
                this.sendNoShowCheckInNextDayArrivalRequest();
                break;
            case 40:
                this.sendDepartureStatus();
                break;
            case 70:
                this.closeCounter();
                break;
        }
    }

    public getLoggedUserDetails() {
        this.nightAuditService.getLoggedUserList().subscribe(res => {
            console.log("logged user list: ", res);
            this.loggedUserList = res['users'];
            this.nightAuditStatus = true;
            this.nightAuditPercent += 10;
        });
    }

    public getOtherUserLoggedOut() {
        let self = this;

        let reqObj = this.loggedUserList.find((loggedUserItem: any) => {
            return loggedUserItem.loginId == this.loggedUserData.userName;
        });

        this.nightAuditService.getOthersLoggedOut(reqObj).subscribe(res => {
            //console.log("res: ", res);
            this.dueInArrivalList = null;
            if (res['successList'][0]['status'].toLowerCase() == 'success') {
                this.nightAuditStatus = true;
                this.nightAuditPercent += 10;
                self.nightAuditService.getDueIns().subscribe(res => {
                    //console.log("due in res: ", res);
                    this.nightAuditPercent += 10;
                    this.allNoShowCkbox = false;
                    this.allNextDayArrivalCkbox = false;
                    this.apiStatusMessage = res['message'];
                    this.dueInArrivalList = res['arrival'].map(item => {
                        item['noShow'] = false;
                        item['nextDayArrival'] = false;
                        return item;
                    });
                })
            } else {
                this.apiStatusMessage = res['message'];
                this.nightAuditStatus = false;
            }
        })
    }

    public selectNoShowCKBStatus(ckBoxType: any) {
        if (ckBoxType == 'all') {
            for (let i = 0; i < this.dueInArrivalList.length; i++) {
                this.dueInArrivalList[i].noShow = this.allNoShowCkbox;
                this.dueInArrivalList[i].nextDayArrival = this.allNoShowCkbox == true ? false : this.dueInArrivalList[i].nextDayArrival;
            }
        } else {
            this.dueInArrivalList[ckBoxType].nextDayArrival = this.dueInArrivalList[ckBoxType].noShow == true ? false : this.dueInArrivalList[ckBoxType].nextDayArrival;
            this.allNextDayArrivalCkbox = this.dueInArrivalList[ckBoxType].nextDayArrival == false ? false : this.allNextDayArrivalCkbox;
            this.allNoShowCkbox = this.dueInArrivalList.every(item => item.noShow);
        }
    }

    public selectNextDayArrivalCKBStatus(ckBoxType: any) {
        if (ckBoxType == 'all') {
            for (let i = 0; i < this.dueInArrivalList.length; i++) {
                this.dueInArrivalList[i].nextDayArrival = this.allNextDayArrivalCkbox;
                this.dueInArrivalList[i].noShow = this.allNextDayArrivalCkbox == true ? false : this.dueInArrivalList[i].noShow;
            }
        } else {
            this.dueInArrivalList[ckBoxType].noShow = this.dueInArrivalList[ckBoxType].nextDayArrival == true ? false : this.dueInArrivalList[ckBoxType].noShow;
            this.allNoShowCkbox = this.dueInArrivalList[ckBoxType].noShow == false ? false : this.allNoShowCkbox;
            this.allNextDayArrivalCkbox = this.dueInArrivalList.every(item => item.nextDayArrival);
        }
    }

    public sendNoShowCheckInNextDayArrivalRequest() {
        let arrivalListLength = this.dueInArrivalList.length;
        let noShowList = [];
        let nextDayArrivalList = [];
        //let arrivalList = [];
        for (let dueInCnt = 0; dueInCnt < arrivalListLength; dueInCnt++) {
            if (this.dueInArrivalList[dueInCnt].noShow == true)
                noShowList.push(this.dueInArrivalList[dueInCnt]);
            else if (this.dueInArrivalList[dueInCnt].nextDayArrival == true)
                nextDayArrivalList.push(this.dueInArrivalList[dueInCnt]);
            // else
            // arrivalList.push(this.dueInArrivalList[dueInCnt]);
        }

        if (noShowList.length > 0) {
            this.nightAuditService.markNoShow({
                "arivals": {
                    "arrival": noShowList
                }
            }).subscribe(res => {
                console.log("response: ", res);
            });
        }

        if (nextDayArrivalList.length > 0) {
            this.nightAuditService.markNextDayArrival({
                "arivals": {
                    "arrival": nextDayArrivalList
                }
            }).subscribe(res => {
                console.log("response: ", res);
                this.getDepartureList();
            });
        }

        // if (arrivalList.length > 0) {
        //     this.nightAuditService.markCheckIn({
        //         "arivals": {
        //             "arrival": arrivalList
        //         }
        //     }).subscribe(res => {
        //         console.log("response: ", res);
        //     });
        // }
        console.log("in call-> send arrival request: ", noShowList.length, nextDayArrivalList.length);

        if (noShowList.length == 0 && nextDayArrivalList.length == 0) {
            console.log("in call getDepartureList: ", noShowList, nextDayArrivalList);
            this.getDepartureList();
        }
    }

    getDepartureList() {
        console.log("at getDepartureList: ");
        this.nightAuditService.getDueOuts().subscribe(res => {
            if (res['status'].toLowerCase() == 'success') {
                this.nightAuditPercent += 10;
                this.dueOutDepartureList = null;
                //console.log("due out req: ", res);
                this.apiStatusMessage = res['message'];
                this.nightAuditStatus = true;
                this.dueOutDepartureList = res['departure'].map(item => {
                    item['isCheckOut'] = false;
                    item['extendStay'] = false;
                    return item;
                });
                console.log("response getDepartureList: ", this.dueOutDepartureList);
            } else {
                this.apiStatusMessage = res['message'];
                this.nightAuditStatus = false;
            }
        })
    }

    selectCheckoutCKBStatus(ckBoxType) {
        if (ckBoxType == 'all') {
            for (let i = 0; i < this.dueOutDepartureList.length; i++) {
                this.dueOutDepartureList[i].isCheckOut = this.allCheckOutCkbox;
                this.dueOutDepartureList[i].extendStay = this.allCheckOutCkbox == true ? false : this.dueOutDepartureList[i].extendStay;
            }
        } else {
            this.allCheckOutCkbox = this.dueOutDepartureList.every(item => item.isCheckOut);
            this.dueOutDepartureList[ckBoxType].extendStay = this.dueOutDepartureList[ckBoxType].isCheckOut == true ? false : this.dueOutDepartureList[ckBoxType].extendStay;
            this.allExtendStayCkbox = this.dueOutDepartureList[ckBoxType].extendStay == false ? false : this.allExtendStayCkbox;
        }
    }

    selectextendStayCKBStatus(ckBoxType) {
        if (ckBoxType == 'all') {
            for (let i = 0; i < this.dueOutDepartureList.length; i++) {
                this.dueOutDepartureList[i].extendStay = this.allExtendStayCkbox;
                this.dueOutDepartureList[i].isCheckOut = this.allCheckOutCkbox == true ? false : this.dueOutDepartureList[i].isCheckOut;
            }
        } else {
            this.allExtendStayCkbox = this.dueOutDepartureList.every(item => item.extendStay);
            this.dueOutDepartureList[ckBoxType].isCheckOut = this.dueOutDepartureList[ckBoxType].extendStay == true ? false : this.dueOutDepartureList[ckBoxType].isCheckOut;
            this.allCheckOutCkbox = this.dueOutDepartureList[ckBoxType].isCheckOut == false ? false : this.allCheckOutCkbox;
        }
    }

    sendDepartureStatus() {
        console.log("at sendDepartureStatus: ");
        let departureListLength = this.dueOutDepartureList.length;
        let checkOutList = [];
        let extendStayList = [];
        //let arrivalList = [];
        for (let dueOutCnt = 0; dueOutCnt < departureListLength; dueOutCnt++) {
            if (this.dueOutDepartureList[dueOutCnt].isCheckOut == true)
                checkOutList.push(this.dueOutDepartureList[dueOutCnt]);
            else if (this.dueOutDepartureList[dueOutCnt].extendStay == true)
                extendStayList.push(this.dueOutDepartureList[dueOutCnt]);
        }

        if (checkOutList.length > 0) {
            this.nightAuditService.markCheckedOut({
                "deprts": {
                    "departure": checkOutList
                }
            }).subscribe(res => {
                console.log("response: ", res);
            });
        }

        if (extendStayList.length > 0) {
            this.nightAuditService.extendStay({
                "deprts": {
                    "departure": extendStayList
                }
            }).subscribe(res => {
                console.log("response: ", res);
                this.nightAuditPercent += 10;
                this.getCloseCounter();
            });
        }

        // if (arrivalList.length > 0) {
        //     this.nightAuditService.markCheckIn({
        //         "arivals": {
        //             "arrival": arrivalList
        //         }
        //     }).subscribe(res => {
        //         console.log("response: ", res);
        //     });
        // }
        //console.log("in call-> getDepartureList: ", checkOutList.length, extendStayList.length);

        if (checkOutList.length == 0 && extendStayList.length == 0) {
            this.nightAuditPercent += 10;
            console.log("in call getDepartureList way: ", checkOutList, extendStayList, this.nightAuditPercent);
            this.getCloseCounter();
        }
    }

    getCloseCounter() {
        console.log("in close counter call");
        this._counterResolverService.getCounterList().subscribe(data => {
            this.nightAuditPercent += 10;
            this.counterList = data['counters'];
        })
    }

    showCounterList() {
        let transSummaryReqObj = {
            'TransactionDate': moment().format("YYYY-MM-DD"),
            "CounterId": this.selectedCounter.counterId
        };
        this.openCloseCashCounterService.getTransactionSummary(transSummaryReqObj).subscribe(res => {
            this.nightAuditPercent += 10;
            this.counterItem = res['transactionSumarry'].filter(res => res.transactionMode == 'Cash')[0];
            console.log("counter list response: ", res['transactionSumarry'], this.counterItem);
        });
    }

    closeCounter() {
        let closeCashCounterReq = {
            "counterId": this.selectedCounter.counterId,
            "counterType": "Cash",
            "businessDate": moment().format("YYYY-MM-DD"),
            "openingBalance": this.openingCashAmt,
            "closingBalance": this.counterItem.closingAmount, // cash closing amount
            "differences": this.counterItem.descripency,
            "cashierId": this.loggedUserData.userName
        };
        //this.nightAuditPercent += 30;
        if (this.openingCashAmt >= 0) {
            this.openCloseCashCounterService.closeCashCounter(closeCashCounterReq).subscribe((closeCashCounterRes: any) => {
                console.log("close cash counter response: ", closeCashCounterRes);
                if (closeCashCounterRes['successList'][0]['status'].toLowerCase() == 'success') {
                    this.nightAuditStatus = true;
                    this.nightAuditPercent += 30;
                } else {
                    this.nightAuditPercent += 10;
                    this.apiStatusMessage = closeCashCounterRes['successList'][0]['message'];
                    this.nightAuditStatus = false;
                }
            })
        }
    }

    getNightAuditStatus() {
        return this._http.post('http://demo5180764.mockable.io/nightaudit/nextphase', {})
            .pipe(
                map(res => res)
            )
    }

    public cancelNightAudit() {
        this.closeNightAuditModal.emit();
    }

    closeModal() {
        this.closeNightAuditModal.emit();
    }
}