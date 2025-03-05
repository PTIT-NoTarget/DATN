import { Component, Input, OnInit } from '@angular/core';
import { IssueStatus, IssueStatusDisplay, JIssue } from '@tungle/interface/issue';
import { ProjectService } from '@tungle/project/state/project/project.service';
import { ProjectQuery } from '@tungle/project/state/project/project.query';

@Component({
  selector: 'issue-status',
  templateUrl: './issue-status.component.html',
  styleUrls: ['./issue-status.component.scss']
})
export class IssueStatusComponent implements OnInit {
  @Input() issue: JIssue | undefined;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  IssueStatusDisplay = IssueStatusDisplay;

  variants = {
    [IssueStatus.BACKLOG]: 'btn-secondary',
    [IssueStatus.NEW]: 'btn-secondary',
    [IssueStatus.IN_PROGRESS]: 'btn-primary',
    // [IssueStatus.READY_TO_TEST]: 'btn-secondary',
    [IssueStatus.TESTING]: 'btn-secondary',
    [IssueStatus.DONE]: 'btn-primary',
    [IssueStatus.REJECT]: 'btn-secondary'
  };

  issueStatuses: IssueStatusValueTitle[] = [];

  constructor(private _projectService: ProjectService, private _projectQuery: ProjectQuery) {}

  ngOnInit(): void {
    this.issueStatuses = [
      new IssueStatusValueTitle(IssueStatus.BACKLOG),
      new IssueStatusValueTitle(IssueStatus.NEW),
      new IssueStatusValueTitle(IssueStatus.IN_PROGRESS),
      // new IssueStatusValueTitle(IssueStatus.READY_TO_TEST),
      new IssueStatusValueTitle(IssueStatus.TESTING),
      new IssueStatusValueTitle(IssueStatus.DONE),
      new IssueStatusValueTitle(IssueStatus.REJECT),
    ];
  }

  updateIssue(status: IssueStatus) {
    const newPosition = this._projectQuery.lastIssuePosition(status);
    this._projectService.updateIssue({
      ...this.issue!,
      status,
      listPosition: newPosition + 1
    });
  }

  isStatusSelected(status: IssueStatus) {
    return this.issue?.status === status;
  }
}

class IssueStatusValueTitle {
  value: IssueStatus;
  label: string;
  constructor(issueStatus: IssueStatus) {
    this.value = issueStatus;
    this.label = IssueStatusDisplay[issueStatus];
  }
}
