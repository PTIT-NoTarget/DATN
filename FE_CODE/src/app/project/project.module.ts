import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { AutofocusDirective } from '@tungle/core/directives/autofocus.directive';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { QuillModule } from 'ngx-quill';
import { JiraControlModule } from '../jira-control/jira-control.module';
import { AddIssueModalComponent } from './components/add-issue-modal/add-issue-modal.component';
import { IssueAssigneesSelectComponent } from './components/add-issue-modal/issue-assignees-select/issue-assignees-select.component';
import { IssuePrioritySelectComponent } from './components/add-issue-modal/issue-priority-select/issue-priority-select.component';
import { IssueReporterSelectComponent } from './components/add-issue-modal/issue-reporter-select/issue-reporter-select.component';
import { IssueTypeSelectComponent } from './components/add-issue-modal/issue-type-select/issue-type-select.component';
import { IssueUtilComponents } from './components/issues';
import { NavigationComponents } from './components/navigation';
import { ResizerComponent } from './components/navigation/resizer/resizer.component';
import { IssueResultComponent } from './components/search/issue-result/issue-result.component';
import { SearchDrawerComponent } from './components/search/search-drawer/search-drawer.component';
import { NZ_JIRA_ICONS } from './config/icons';
import { BoardComponent } from './pages/board/board.component';
import { FullIssueDetailComponent } from './pages/full-issue-detail/full-issue-detail.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProjectsModule } from './pages/projects/projects.module';
import { SharedUserModule } from './components/user/user.module';
import { SharedIssuesModule } from './components/issues/issues.module';
import { SharedBoardModule } from './components/board/board.module';
import { HeaderModule } from "./components/header/header.module";
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AutofocusDirective,
    ...NavigationComponents,
    ProjectComponent,
    BoardComponent,
    SettingsComponent,
    FullIssueDetailComponent,
    SearchDrawerComponent,
    IssueResultComponent,
    AddIssueModalComponent,
    IssueTypeSelectComponent,
    IssuePrioritySelectComponent,
    IssueReporterSelectComponent,
    IssueAssigneesSelectComponent,
    ResizerComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ProjectsModule,
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
    SharedUserModule,
    SharedIssuesModule,
    SharedBoardModule,
    HeaderModule
]
})
export class ProjectModule {}
