import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild  } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminService } from '../../../services/admin.service';
import { IUsersDetails } from '../UserDetails';
import { ConfirmPopupComponent } from '../../../../shared/components/confirm.popup.component';

@Component({
    selector: 'app-admin-user-basic-details',
    templateUrl: './admin.user.basic.details.component.html'
})
export class AdminUserBasicDetailsComponent implements OnInit {

    @Output() userDetailViewChange = new EventEmitter();
    @Input() userDetails: IUsersDetails;

    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    userData: any;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminService
    ) { }

    ngOnInit() {
        let headerBuffer = 65;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        //this.getUserDetails();
        console.log("user details->->: ", this.userDetails);
        
    }

    /*public getUserDetails() {
        this.userData = {
            id: 1,
            username: 'User 1',
            phonenumber: '6584656468',
            editable: false,
        };
    }*/

    public openUserWorkDetails() {
        let count = 2;
        //console.log("in user details",count);        
        this.userDetailViewChange.emit(count);
    }
}