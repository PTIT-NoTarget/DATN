import { Component, inject, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup } from '@angular/forms';
import { NotiService } from '@tungle/core/services/noti.service';
import { IGetAllUserReq, UserService } from '@tungle/core/apis/user.service';
import { JUser } from '@tungle/interface/user';
import { DEFAULT_AVATAR_URL } from '@tungle/project/config/icons';
import { NotificationService } from '@tungle/core/apis/notification.service';

@Component({
  selector: 'noti-management-edit',
  templateUrl: './noti-management-edit.component.html',
  styleUrls: ['./noti-management-edit.component.scss']
})
export class NotiManagementEditComponent implements OnInit {
  @Input() mode: 0 | 1 = 0; // 0: create; 1: view
  @Input() notiId: number = -1;

  form = new FormGroup({
    title: new FormControl(''),
    seen: new FormControl(false),
    metadata: new FormControl(''),
    message: new FormControl(),
    user_id: new FormControl(0)
  });

  users: JUser[] = [];

  isLoading: boolean = false;

  constructor(
    private nzModalRef: NzModalRef,
    private notiService: NotiService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.initView()
  }

  async initView() {
    await this.getAllUsers();
    await this.getNoti();
  }

  async getNoti() {
    if (!this.notiId) {
      return;
    }
    const res = await this.notificationService.getANoti(this.notiId);
    this.form.patchValue({ ...res });
  }

  async addNoti() {
    await this.notificationService
      .addANoti(this.form.getRawValue())
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
