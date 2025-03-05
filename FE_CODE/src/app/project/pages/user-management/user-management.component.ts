import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserManagementEditComponent } from './user-management-edit/user-management-edit.component';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '@tungle/core/apis/user.service';
import { ExcelService, IExcelCol } from '@tungle/core/apis/excel.service';
import { GENDERS, POSITION_LEVEL, POSITIONS, POSITIONS_1 } from '@tungle/core/common/user/user';
import { CommonUserService, ISelect } from '@tungle/core/services/common-user.service';
import { NotiService } from '@tungle/core/services/noti.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  listOfColumn = [
    {
      title: 'ID',
      compare: (a: ItemData, b: ItemData) => a.id - b.id,
      priority: false
    },
    {
      title: 'Username',
      compare: (a: ItemData, b: ItemData) => a.username.localeCompare(b.username),
      priority: false
    },
    {
      title: 'Họ và tên',
      compare: (a: ItemData, b: ItemData) => a.name.localeCompare(b.name),
      priority: false
    },
    {
      title: 'Email',
      compare: (a: ItemData, b: ItemData) => a.email.localeCompare(b.email),
      priority: false
    },
    {
      title: 'Ngày sinh',
      compare: (a: ItemData, b: ItemData) => a.dob.localeCompare(b.dob),
      priority: false
    },
    {
      title: 'Giới tính',
      compare: (a: ItemData, b: ItemData) => a.sex.localeCompare(b.sex),
      priority: false
    },
    {
      title: 'Ngày tạo',
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

  genders: IGender[] = GENDERS;

  form = new FormGroup({
    page: new FormControl(1),
    pageSize: new FormControl(10),
    id: new FormControl(),
    fullName: new FormControl(),
    email: new FormControl(),
    dob: new FormControl(),
    sex: new FormControl(),
    createdAt: new FormControl()
  });

  totalCount!: number;

  constructor(
    private nzModalService: NzModalService,
    private userService: UserService,
    private excelService: ExcelService,
    private commonUserService: CommonUserService,
    private notiService: NotiService
  ) {}

  async ngOnInit() {
    await this.getAllUsers();
  }

  async getAllUsers() {
    const res = await this.userService.getAllUser(this.form.getRawValue());
    this.totalCount = res.totalItems;

    this.listOfData = res.users.map((item) => {
      const rec: ItemData = {
        id: item.id,
        username: item.username,
        name: item.fullName,
        email: item.email,
        dob: item.dob,
        sex: item.sex,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };

      return rec;
    });
  }

  async changePage($event: number) {
    this.form.patchValue({ page: $event });
    await this.getAllUsers();
  }

  async changePageSize($event: number) {
    this.form.patchValue({ pageSize: $event });
    await this.getAllUsers();
  }

  openEditModal(userId?: number) {
    const mode = userId ? 1 : 0;

    const modal = this.nzModalService.create<
      UserManagementEditComponent,
      IUserManagementEditModalData
    >({
      nzContent: UserManagementEditComponent,
      nzFooter: null,
      nzComponentParams: {
        mode: mode,
        userId: userId
      }
    });

    modal.afterClose.subscribe((data) => {
      if (data) {
        this.getAllUsers();
      }
    });
  }

  cancel() {
    this.form.reset();
    this.form.patchValue({
      page: 1,
      pageSize: 10
    });
    this.getAllUsers();
  }

  search() {
    console.log(this.form.getRawValue());
    this.getAllUsers();
  }

  async deleteUser(userId: number) {
    await this.userService
      .deleteAUser({
        id: userId
      })
      .then(() => {
        this.notiService.success();
        this.getAllUsers();
      })
      .catch(() => this.notiService.error());
  }

  showConfirmResetPassword(row: any): void {
    this.nzModalService.confirm({
      nzTitle: 'Reset mật khẩu tài khoản',
      nzContent: `Tài khoản "${row.name}" sẽ được reset về mật khẩu mặc định. Xác nhận reset mật khẩu?`,
      nzOnOk: async () => {
        await this.resetPassword(row);
      },
      nzCentered: true
    });
  }

  async resetPassword(row: any) {
    console.log('row', row);
    await this.userService
      .updateAUser({
        ...row,
        password: '123456'
      })
      .then(() => {
        this.notiService.success();
      })
      .catch(() => this.notiService.error());
  }

  exportExcel() {
    const colData: IExcelCol[] = [
      {
        key: 'id',
        name: 'Id',
        width: 5
      },
      {
        key: 'username',
        name: 'Username',
        width: 15
      },
      {
        key: 'name',
        name: 'Họ và tên',
        width: 15
      },
      {
        key: 'email',
        name: 'Email',
        width: 15
      },
      {
        key: 'dob',
        name: 'Ngày sinh',
        width: 15
      },
      {
        key: 'sex',
        name: 'Giới tính',
        width: 10
      },
      {
        key: 'createdAt',
        name: 'Ngày tạo',
        width: 15
      },
      {
        key: 'updatedAt',
        name: 'Ngày cập nhật',
        width: 15
      }
    ];
    const fileName = 'Danh sách người dùng';
    const sheetName = 'Danh sách người dùng';

    this.excelService.exportExcel(this.listOfData, colData, sheetName, fileName);
  }

  getNameByCode(arr: ISelect[], code: string): string {
    return this.commonUserService.getNameByCode(arr, code);
  }
}

interface ItemData {
  id: number;
  username: string;
  name: string;
  email: string;
  dob: string;
  sex: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserManagementEditModalData {
  mode: 0 | 1 | 2; // 0: create; 1: update; 2: view
  userId: number | undefined;
}

export interface IGender {
  label: string;
  value: string;
}
