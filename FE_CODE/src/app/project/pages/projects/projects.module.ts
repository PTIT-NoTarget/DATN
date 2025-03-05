import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { QuillModule } from 'ngx-quill';
import { ProjectsRoutingModule } from './projects-routing.module';
import { NZ_JIRA_ICONS } from '@tungle/project/config/icons';
import { JiraControlModule } from '@tungle/jira-control/jira-control.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProjectsComponent } from './projects.component';
import { ProjectsAddComponent } from './projects-add/projects-add.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { SharedUserModule } from '@tungle/project/components/user/user.module';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ProjectsDetailComponent } from './projects-detail/projects-detail.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { SharedBoardModule } from '@tungle/project/components/board/board.module';
import { ProjectsMembersAddComponent } from './projects-members-add/projects-members-add.component';
@NgModule({
  declarations: [ProjectsComponent, ProjectsAddComponent, ProjectsDetailComponent, ProjectsListComponent, ProjectsMembersAddComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
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
    QuillModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    SharedUserModule,
    NzPopconfirmModule,
    SharedBoardModule
  ],
  providers: [{ provide: NzModalRef, useValue: {} }]
})
export class ProjectsModule {}
