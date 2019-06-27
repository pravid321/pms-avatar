import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { AdminUserService } from '../user-manager/admin.user.service';
import { AdminUserBasicDetailsComponent } from './user-basic-details/admin.user.basic.details.component';
import { AdminUserPermissionComponent } from './user-permission/admin.user.permission.component';
import { AdminUserWorkDetailsComponent } from './user-work-details/admin.user.work.details.component';
import { ConfirmPopupComponent } from '../../../shared/components/confirm.popup.component';
import { IDepartmentList } from '../manage-department/Department';
import { IUsersDetails } from './UserDetails';

export const userManagerComponents = [AdminUserBasicDetailsComponent, AdminUserWorkDetailsComponent, AdminUserPermissionComponent];

@Component({
    selector: 'app-admin-user-creation-layout',
    templateUrl: './user.creation.layout.component.html'
})
export class AdminUserCreationLayoutComponent implements OnInit {
    modalRef: BsModalRef;
    alertMessageDetails = {
        response: false,
        type: null,
        message: null
    };
    intercomList: any;
    departmentList: IDepartmentList;
    userDetails: IUsersDetails;
    public config: PerfectScrollbarConfigInterface = {};
    public scrollBarContainerHeight: number;

    public userView: string;

    constructor(
        private modalService: BsModalService,
        private _adminData: AdminUserService
    ) { }

    ngOnInit() {
        let headerBuffer = 60;
        this.scrollBarContainerHeight = $(document).height() - ($("#main-navbar").outerHeight() + $("#sub-navbar").outerHeight() + $("#footerButtonContainer").outerHeight() + $("#pageHeading").outerHeight() + headerBuffer + 155);
        //console.log("in ng on in it: ", $(document).height(), $("#main-navbar").outerHeight(), $("#sub-navbar").outerHeight(), $("#footerButtonContainer").outerHeight(), $("#pageHeading").outerHeight(), headerBuffer, this.scrollBarContainerHeight);      
        this.getDepartmentList();

        this.userView = 'user_basic_details';// "user_basic_details"; //user_work_details
        this.userDetails = {
            "Employee": {
                "empName": null,
                "address1": null,
                "address2": null,
                "city": null,
                "state": null,
                "country": null,
                "email": null,
                "phone": null,
                "department": null,
                "designation": null,
                "zipCode": null,
                "mobile": null,
                "emergencyNumber": null,
                "gender": 'Male',
                "dOB": null,
                "iDType": null,
                "iD": null,
                "bloodGroup": null,
                "dOJ": null
            },
            "User": {
                "userName": null,
                "loginId": null,
                "password": null,
                "userType": null,
                "isChainUser": null,
                "hotelId": null,
                "posUnlockPin": null,
                "permittedIps": null,
                "shiftFrom": null,
                "shiftTo": null,
                "counter": null
            }
        }
    }

    public getDepartmentList() {
        this._adminData.getDataList('Config/Departments/getDepartments/', 'departments').subscribe(deptRes => {
            this.departmentList = deptRes;
        });
    }

    public openWorkDetailsView(count) {
        this.userView = 'user_work_details';
    }

    public openBasicDetailsView(count) {
        this.userView = 'user_basic_details';
    }

}