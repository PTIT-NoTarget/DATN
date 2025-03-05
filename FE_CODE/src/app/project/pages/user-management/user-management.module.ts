import { NgModule } from '@angular/core';
import { UserManagementComponent } from './user-management.component';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserManagementEditComponent } from './user-management-edit/user-management-edit.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@NgModule({
  declarations: [UserManagementComponent, UserManagementEditComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzDatePickerModule,
    NzSelectModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NzPopconfirmModule,
    SharedModule
  ],
  exports: [],
})
export class UserManagementModule {}
