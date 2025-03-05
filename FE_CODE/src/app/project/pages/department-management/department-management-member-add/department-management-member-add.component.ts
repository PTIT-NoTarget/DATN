import { Component, inject, Input, OnInit } from '@angular/core';
import { IDepartmentManagementMemberAddModalData } from '../department-management.component';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup } from '@angular/forms';
import { JUser } from '@tungle/interface/user';
import {
  DepartmentsService,
  IAddMembersReq,
  IDeleteMemberFromDepartmentReq
} from '@tungle/core/apis/department.service';
import { NotiService } from '@tungle/core/services/noti.service';

@Component({
  selector: 'app-department-management-member-add',
  templateUrl: './department-management-member-add.component.html',
  styleUrls: ['./department-management-member-add.component.scss']
})
export class DepartmentManagementMemberAddComponent implements OnInit {
  @Input() users: JUser[] = [];
  @Input() departmentId: number = -1;

  selectedUserId: number = -1;
  listMember: JUser[] = [];

  form = new FormGroup({
    departmentId: new FormControl(),
    memberId: new FormControl()
  });

  isLoading: boolean = false;

  constructor(private departmentService: DepartmentsService, private notiService: NotiService) {}

  async ngOnInit() {
    await this.getListMembers();
  }

  getListUser() {
    return this.users.filter((user) => !this.listMember.find((item) => item.id === user.id));
  }

  getMemberUser(userId: number): JUser {
    return this.users.find((user) => user.id === userId)!;
  }

  getMemberSelected(): JUser[] {
    return this.users.filter((user) => Number(user.id) === this.selectedUserId);
  }

  async addMembersToDepartment() {
    const body: IAddMembersReq = {
      departmentId: this.departmentId,
      userIds: [this.selectedUserId]
    };

    await this.departmentService
      .addMembersToDepartment(body)
      .then(async (data) => {
        await this.getListMembers();
        this.selectedUserId = -1;
        this.notiService.success();
      })
      .catch((err) => this.notiService.error());
  }

  async getListMembers() {
    const res = await this.departmentService.getADepartment(this.departmentId);
    this.listMember =
      res?.users.map((item) => {
        const rec: JUser = {
          id: item.id,
          fullName: item.fullName,
          email: item.email,
          avatarUrl: item.avatarUrl,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
          // issueIds: []
        };

        return rec;
      }) ?? [];
  }

  async deleteMember(userId: number) {
    const body: IDeleteMemberFromDepartmentReq = {
      departmentId: this.departmentId,
      userId: userId
    };

    await this.departmentService
      .deleteMemberFromDepartment(body)
      .then(async (data) => {
        await this.getListMembers();
        this.notiService.success();
      })
      .catch((err) => this.notiService.error());
  }
}
