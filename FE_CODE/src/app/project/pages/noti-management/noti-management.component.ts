import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup } from '@angular/forms';
import { IGetAllUserReq, UserService } from '@tungle/core/apis/user.service';
import { DEFAULT_AVATAR_URL } from '@tungle/project/config/icons';
import { JUser } from '@tungle/interface/user';
import { NotificationService } from '@tungle/core/apis/notification.service';
import { NotiManagementEditComponent } from './noti-management-edit/noti-management-edit.component';
import { NotiService } from '@tungle/core/services/noti.service';

@Component({
  selector: 'noti-management',
  templateUrl: './noti-management.component.html',
  styleUrls: ['./noti-management.component.scss']
})
export class NotiManagementComponent implements OnInit {
  totalCount!: number;

  listOfColumn = [
    {
      title: 'ID',
      compare: (a: ItemData, b: ItemData) => a.id - b.id,
      priority: false
    },
    {
      title: 'Nội dung thông báo',
      compare: (a: ItemData, b: ItemData) => a.message.localeCompare(b.message),
      priority: false
    },
    {
      title: 'Ngày gửi',
      compare: (a: ItemData, b: ItemData) => a.createdAt.localeCompare(b.createdAt),
      priority: false
    },
    {
      title: 'Ngày cập nhật',
      compare: (a: ItemData, b: ItemData) => a.updatedAt.localeCompare(b.updatedAt),
      priority: false
    },
    {
      title: 'Thao tác',
      compare: null,
      priority: false
    }
  ];

  listOfData: ItemData[] = [];

  form = new FormGroup({
    page: new FormControl(1),
    pageSize: new FormControl(10),
    user_id: new FormControl(0)
  });

  users: JUser[] = [];

  constructor(
    private nzModalService: NzModalService,
    private notificationService: NotificationService,
    private userService: UserService,
    private notiService: NotiService
  ) {}

  async ngOnInit() {
    await this.getAllUsers();
    await this.getAllNoti();
  }

  async getAllNoti() {
    const res = await this.notificationService.getAllNoti(this.form.getRawValue());
    this.totalCount = res.totalItems;

    this.listOfData = res.notis.map((item) => {
      const rec: ItemData = {
        id: item.id,
        message: item.message,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };

      return rec;
    });
  }

  openEditModal(notiId?: number) {
    const mode = notiId ? 1 : 0;
    const modal = this.nzModalService.create<NotiManagementEditComponent, any>({
      nzContent: NotiManagementEditComponent,
      nzFooter: null,
      nzComponentParams: {
        mode: mode,
        notiId: notiId
      }
    });
    modal.afterClose.subscribe((data) => {
      if (data) {
        this.getAllNoti();
      }
    });
  }

  cancel() {
    this.form.reset();
    this.form.patchValue({
      page: 1,
      pageSize: 10
    });
    this.getAllNoti();
  }

  search() {
    this.getAllNoti();
  }

  async deleteNoti(notiId: number) {
    await this.notificationService
      .deleteANoti({
        id: notiId
      })
      .then(() => {
        this.notiService.success();
        this.getAllUsers();
      })
      .catch(() => this.notiService.error());
  }

  async changePage($event: number) {
    this.form.patchValue({ page: $event });
    await this.getAllNoti();
  }

  async changePageSize($event: number) {
    this.form.patchValue({ pageSize: $event });
    await this.getAllNoti();
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

  getMemberName(id: number): string {
    return this.users.find((item) => item.id === id)?.fullName ?? '';
  }
}

interface ItemData {
  id: number;
  message: string;
  createdAt: string;
  updatedAt: string;
}
