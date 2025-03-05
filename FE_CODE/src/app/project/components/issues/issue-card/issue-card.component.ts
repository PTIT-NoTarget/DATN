import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JIssue } from '@tungle/interface/issue';
import { IssuePriorityIcon } from '@tungle/interface/issue-priority-icon';
import { JUser } from '@tungle/interface/user';
import { ProjectQuery } from '@tungle/project/state/project/project.query';
import { IssueUtil } from '@tungle/project/utils/issue';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { IDeleteATaskReq, TaskService } from '@tungle/core/apis/task.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { ProjectService } from '@tungle/project/state/project/project.service';

@Component({
  selector: 'issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.scss']
})
@UntilDestroy()
export class IssueCardComponent implements OnChanges, OnInit {
  @Input() issue: JIssue | undefined;
  assignees: (JUser | undefined)[] = [];
  issueTypeIcon: string = '';
  priorityIcon: IssuePriorityIcon | undefined;
  members: JUser[] = [];

  constructor(
    private _projectQuery: ProjectQuery,
    private _modalService: NzModalService,
    private taskService: TaskService,
    private notiService: NotiService,
    private _projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // this._projectQuery.users$.pipe(untilDestroyed(this)).subscribe((users) => {
    //   this.assignees = this.issue!.userIds?.map((userId) => users.find((x) => x.id === userId));
    // });
    this._projectQuery.users$.pipe(untilDestroyed(this)).subscribe((users) => {
      this.members = users;
      this.assignees = this.issue!.userIds?.map((userId) => users.find((x) => x.id === userId));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const issueChange = changes.issue;
    if (issueChange?.currentValue !== issueChange.previousValue) {
      this.issueTypeIcon = IssueUtil.getIssueTypeIcon(this.issue!.type);
      this.priorityIcon = IssueUtil.getIssuePriorityIcon(this.issue!.priority);
    }
  }

  openIssueModal(issueId: number) {
    this._modalService.create({
      nzContent: IssueModalComponent,
      nzWidth: 1040,
      nzClosable: false,
      nzFooter: null,
      nzComponentParams: {
        issue$: this._projectQuery.issueById$(issueId),
      }
    });
  }

  async deleteTask(id: number) {
    const body: IDeleteATaskReq = {
      id: Number(id)
    };
    await this.taskService
      .deleteATask(body)
      .then((data) => {
        if (data.success) {
          this._projectService.deleteTask(Number(id));
          this.notiService.success();
        } else {
          this.notiService.error();
        }
      })
      .catch((err) => {
        this.notiService.error();
      });
  }

  getUserDetail(userId: number | null): JUser | null {
    if (!userId) {
      return null;
    }
    const member = this.members.find((item) => item.id === userId)!;
    return member;
  }
}
