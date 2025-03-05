import { NgModule } from '@angular/core';
import { JiraControlModule } from '@tungle/jira-control/jira-control.module';
import { IssueUtilComponents } from '.';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_JIRA_ICONS } from '@tungle/project/config/icons';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { SharedUserModule } from '../user/user.module';
import { QuillModule } from 'ngx-quill';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@NgModule({
  declarations: [IssueUtilComponents],
  imports: [
    CommonModule,
    JiraControlModule,
    NzToolTipModule,
    DragDropModule,
    NzDropDownModule,
    CommonModule,
    NzIconModule.forChild(NZ_JIRA_ICONS),
    NzToolTipModule,
    NzModalModule,
    NzDropDownModule,
    NzSelectModule,
    NzNotificationModule,
    NzDrawerModule,
    NzPopoverModule,
    DragDropModule,
    TextFieldModule,
    FormsModule,
    ReactiveFormsModule,
    JiraControlModule,
    ContentLoaderModule,
    SharedUserModule,
    QuillModule,
    NzInputModule,
    NzPopconfirmModule
  ],
  exports: [IssueUtilComponents]
})
export class SharedIssuesModule {}
