import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IssuePriority, IssueStatus, IssueType, JIssue } from '@tungle/interface/issue';
import { ProjectQuery } from '@tungle/project/state/project/project.query';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IssueDeleteModalComponent } from '../issue-delete-modal/issue-delete-modal.component';
import { DeleteIssueModel } from '@tungle/interface/ui-model/delete-issue-model';
import { JTask } from '@tungle/interface/project';

@Component({
  selector: 'issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent {
  @Input() issue: JIssue | null | undefined;
  @Input() isShowFullScreenButton!: boolean;
  @Input() isShowCloseButton!: boolean;
  @Output() onClosed = new EventEmitter();
  @Output() onOpenIssue = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<DeleteIssueModel>();

  //by tung
  @Input() task: JTask | null | undefined;

  constructor(public projectQuery: ProjectQuery, private _modalService: NzModalService) {}

  ngOnInit() {}

  openDeleteIssueModal() {
    this._modalService.create({
      nzContent: IssueDeleteModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzStyle: {
        top: '140px'
      },
      nzComponentParams: {
        issueId: this.issue?.id,
        onDelete: this.onDelete
      }
    });
  }

  closeModal() {
    this.onClosed.emit();
  }

  openIssuePage() {
    this.onOpenIssue.emit(this.issue?.id);
  }

  // convertTaskToIssue(): JIssue {
  //   return {
  //     id: this.task?.id!,
  //     title: this.task?.name ?? '',
  //     type: this.task?.label as any,
  //     status: this.task?.status as any,
  //     priority: this.task?.priority as any,
  //     listPosition: 0,
  //     description: this.task?.description ?? '',
  //     estimate: this.task?.story_point ?? 0,
  //     timeSpent: this.task?.story_point ?? 0,
  //     timeRemaining: this.task?.story_point ?? 0,
  //     createdAt: this.task?.createdAt ?? '',
  //     updatedAt: this.task?.updatedAt ?? '',
  //     reporterId: this.task?.assigned_by! ?? '',
  //     userIds: [],
  //     comments: [],
  //     projectId: this.task?.project_id!
  //   };
  // }
}
