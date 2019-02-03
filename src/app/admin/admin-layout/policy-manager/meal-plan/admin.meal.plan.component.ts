import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminService } from '../../../services/admin.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';

@Component({
    selector: 'app-admin-layout-meal-plan',
    templateUrl: './admin.meal.plan.component.html'
})
export class AdminMealPlanComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    mealPlanList: any;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.getMealPlanList();
    }

    public getMealPlanList() {
        this.mealPlanList = [
            {
                id: 1,
                name: 'Breakfast included',
                isApplied: true,
                description: 'Breakfast included',
                charge: 500,
                percent: false,
                editable: false,
            },
            {
                id: 2,
                name: 'Breakfast excluded',
                isApplied: true,
                description: 'Breakfast included',
                charge: 0,
                percent: false,
                editable: false,
            },
            {
                id: 2,
                name: 'All inclusive',
                isApplied: true,
                description: 'All inclusive',
                charge: 0,
                percent: false,
                editable: false,
            }
        ];
    }
}