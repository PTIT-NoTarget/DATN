import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartmentManagementEditComponent } from './department-management-edit/department-management-edit.component';
import { DepartmentManagementMemberAddComponent } from './department-management-member-add/department-management-member-add.component';
import { DepartmentsService } from '@tungle/core/apis/department.service';
import { IGetAllUserReq, UserService } from '@tungle/core/apis/user.service';
import { DEFAULT_AVATAR_URL } from '@tungle/project/config/icons';
import { JUser } from '@tungle/interface/user';
import { ExcelService, IExcelCol } from '@tungle/core/apis/excel.service';
import { NotiService } from '@tungle/core/services/noti.service';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.scss']
})
export class DepartmentManagementComponent implements OnInit {
  totalCount!: number;

  listOfColumn = [
    {
      title: 'ID',
      compare: (a: ItemData, b: ItemData) => a.id - b.id,
      priority: false
    },
    {
      title: 'Tên phòng ban',
      compare: (a: ItemData, b: ItemData) => a.name.localeCompare(b.name),
      priority: false
    },
    {
      title: 'Quản lý',
      compare: (a: ItemData, b: ItemData) => a.manager_id - b.manager_id,
      priority: false
    },
    {
      title: 'Số lượng thành viên',
      compare: (a: ItemData, b: ItemData) => a.memberQuantity - b.memberQuantity,
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

  form = new FormGroup({
    page: new FormControl(1),
    pageSize: new FormControl(10),
    id: new FormControl(),
    name: new FormControl(),
    manager_id: new FormControl(),
    memberQuantity: new FormControl(),
    createdAt: new FormControl()
  });

  users: JUser[] = [];

  constructor(
    private nzModalService: NzModalService,
    private departmentService: DepartmentsService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private excelService: ExcelService,
    private notiService: NotiService
  ) {}

  async ngOnInit() {
    await this.getAllUsers();
    await this.getAllDepartments();
  }

  async getAllDepartments() {
    const res = await this.departmentService.getAllDepartment(this.form.getRawValue());
    this.totalCount = res.totalItems;

    this.listOfData = res.departments.map((item) => {
      const rec: ItemData = {
        id: item.id,
        name: item.name ?? '',
        manager_id: item.manager_id ?? -1,
        managerName: this.getMemberName(item.manager_id!),
        memberQuantity: item.users.length,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };

      return rec;
    });

      this.cdr.detectChanges();
  }

  openEditModal(departmentId?: number) {
    const mode = departmentId ? 1 : 0;
    const modal = this.nzModalService.create<
      DepartmentManagementEditComponent,
      IDepartmentManagementEditModalData
    >({
      nzContent: DepartmentManagementEditComponent,
      nzFooter: null,
      nzComponentParams: {
        mode: mode,
        departmentId: departmentId
      }
    });
    modal.afterClose.subscribe((data) => {
      this.getAllDepartments();
    });
  }

  cancel() {
    this.form.reset();
    this.form.patchValue({
      page: 1,
      pageSize: 10
    });
    this.getAllDepartments();
  }

  search() {
    this.getAllDepartments();
  }

  async deleteDepartment(departmentId: number) {
    await this.departmentService
      .deleteADepartment({
        id: departmentId
      })
      .then(() => {
        this.notiService.success();
        this.getAllDepartments();
      })
      .catch(() => this.notiService.error());
  }

  openMemberAddModal(departmentId: number) {
    const modal = this.nzModalService.create<
      DepartmentManagementMemberAddComponent,
      IDepartmentManagementMemberAddModalData
    >({
      nzContent: DepartmentManagementMemberAddComponent,
      nzFooter: null,
      nzComponentParams: {
        departmentId: departmentId,
        users: this.users
      }
    });
    modal.afterClose.subscribe((data) => {
      this.getAllDepartments();
    });
  }

  async changePage($event: number) {
    this.form.patchValue({ page: $event });
    await this.getAllDepartments();
  }

  async changePageSize($event: number) {
    this.form.patchValue({ pageSize: $event });
    await this.getAllDepartments();
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

  exportExcel() {
    const colData: IExcelCol[] = [
      {
        key: 'id',
        name: 'Id',
        width: 5
      },
      {
        key: 'username',
        name: 'Tên phòng ban',
        width: 25
      },
      {
        key: 'managerName',
        name: 'Quản lý',
        width: 25
      },
      {
        key: 'memberQuantity',
        name: 'Số lượng thành viên',
        width: 25
      },
      {
        key: 'createdAt',
        name: 'Ngày tạo',
        width: 25
      },
      {
        key: 'updatedAt',
        name: 'Ngày cập nhật',
        width: 25
      }
    ];
    const fileName = 'Danh sách phòng ban';
    const sheetName = 'Danh sách phòng ban';

    this.excelService.exportExcel(this.listOfData, colData, sheetName, fileName);
  }
}

interface ItemData {
  id: number;
  name: string;
  manager_id: number;
  memberQuantity: number;
  createdAt: string;
  updatedAt: string;
  managerName?: string;
}

export interface IDepartmentManagementEditModalData {
  mode: 0 | 1; // 0: create; 1: update
  departmentId: number | undefined;
}

export interface IDepartmentManagementMemberAddModalData {
  departmentId: number;
}
