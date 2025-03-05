import { NgModule } from '@angular/core';
import { JiraControlModule } from '@tungle/jira-control/jira-control.module';
import { BoardPageComponents } from '.';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedIssuesModule } from '../issues/issues.module';

@NgModule({
  declarations: [BoardPageComponents],
  imports: [CommonModule, JiraControlModule, NzToolTipModule, DragDropModule, SharedIssuesModule],
  exports: [BoardPageComponents]
})
export class SharedBoardModule {}
