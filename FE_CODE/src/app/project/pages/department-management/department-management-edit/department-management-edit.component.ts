import { Component, inject, Input, OnInit } from '@angular/core';
import { IDepartmentManagementEditModalData } from '../department-management.component';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartmentsService } from '@tungle/core/apis/department.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { IGetAllUserReq, UserService } from '@tungle/core/apis/user.service';
import { JUser } from '@tungle/interface/user';
import { DEFAULT_AVATAR_URL } from '@tungle/project/config/icons';

@Component({
  selector: 'app-department-management-edit',
  templateUrl: './department-management-edit.component.html',
  styleUrls: ['./department-management-edit.component.scss']
})
export class DepartmentManagementEditComponent implements OnInit {
  @Input() mode: 0 | 1 = 0; // 0: create; 1: update
  @Input() departmentId: number = -1;

  form = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    manager_id: new FormControl()
  });

  users: JUser[] = [];

  isLoading: boolean = false;

  constructor(
    private nzModalRef: NzModalRef,
    private departmentService: DepartmentsService,
    private notiService: NotiService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    await this.initView()
  }

  async initView() {
    await this.getAllUsers();
    await this.getDepartment();
  }

  async getDepartment() {
    if (!this.departmentId) {
      return;
    }
    const res = await this.departmentService.getADepartment(this.departmentId);
    this.form.patchValue({ ...res });
  }

  async addDepartment() {
    await this.departmentService
      .addADepartment(this.form.getRawValue())
      .then(() => {
        this.notiService.success();
        this.nzModalRef.close(true);
      })
      .catch((err) => {
        this.notiService.error();
      });
  }

  async updateDepartment() {
    this.form.patchValue({
      id: this.departmentId,
      password: null
    });

    await this.departmentService
      .updateADepartment(this.form.getRawValue())
      .then(() => {
        this.notiService.success();
        this.nzModalRef.close(true);
      })
      .catch((err) => {
        this.notiService.error();
      });
  }

  close() {
    this.nzModalRef.close();
  }

  async getAllUsers() {
    const body: IGetAllUserReq = {
      page: 1,
      pageSize: 9999
    };

    const res = await this.userService.getAllUser(body);
    const users = res.users ?? [];
    this.users = users.map((item) => {
      const rec: JUser = {
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        avatarUrl: item.avatarUrl ?? DEFAULT_AVATAR_URL,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
        // issueIds: []
      };
      return rec;
    });
  }

  getUser(): JUser {
    return this.users.find((user) => user.id === this.form.get('manager_id')?.value)!;
  }
}
