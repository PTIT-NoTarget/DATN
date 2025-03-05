import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { SharedUserModule } from '../../components/user/user.module';
import { NotiManagementRoutingModule } from './noti-management-routing.module';
import { NotiManagementComponent } from './noti-management.component';
import { NotiManagementEditComponent } from './noti-management-edit/noti-management-edit.component';

@NgModule({
  declarations: [NotiManagementComponent, NotiManagementEditComponent],
  imports: [
    CommonModule,
    NotiManagementRoutingModule,
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
    SharedUserModule
  ],
  exports: []
})
export class NotiManagementModule {}
