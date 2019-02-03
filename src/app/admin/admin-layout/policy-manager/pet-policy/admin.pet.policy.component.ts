import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminService } from '../../../services/admin.service';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';

@Component({
    selector: 'app-admin-layout-pet-policy',
    templateUrl: './admin.pet.policy.component.html'
})
export class AdminPetPolicyComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    petPolicyList: any;
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
        this.getPetPolicyList();
    }

    public getPetPolicyList() {
        this.petPolicyList = [
            {
                id: 1,
                name: 'Pets are allowed. Service charge applicable.',
                isApplied: true,
                description: 'Pets are allowed. Service charge applicable.',
                charge: 200,
                percent: false,
                editable: false,
            },
            {
                id: 2,
                name: 'Pets are not allowed.',
                isApplied: true,
                description: 'Pets are not allowed.',
                charge: 0,
                percent: false,
                editable: false,
            },
            {
                id: 3,
                name: 'Pets are allowed. Nightly charge applicable.',
                isApplied: true,
                description: 'Pets are allowed. Nightly charge applicable.',
                charge: 40,
                percent: true,
                editable: false,
            },
        ];
    }
}