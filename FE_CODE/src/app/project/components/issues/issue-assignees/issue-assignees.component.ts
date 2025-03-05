import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { JIssue } from '@tungle/interface/issue';
import { JUser } from '@tungle/interface/user';
import { ProjectService } from '@tungle/project/state/project/project.service';

@Component({
  selector: 'issue-assignees',
  templateUrl: './issue-assignees.component.html',
  styleUrls: ['./issue-assignees.component.scss']
})
@UntilDestroy()
export class IssueAssigneesComponent implements OnInit, OnChanges {
  @Input() issue: JIssue | undefined;
  @Input() users: JUser[] | null = null;
  assignees: (JUser | undefined)[] = [];

  constructor(private _projectService: ProjectService) {}

  ngOnInit(): void {
    this.assignees = this.issue!.userIds?.map((userId) => this.users!.find((x) => x.id === userId));
  }

  ngOnChanges(changes: SimpleChanges) {
    const issueChange = changes.issue;
    if (this.users && issueChange.currentValue !== issueChange.previousValue) {
      this.assignees = this.issue!.userIds?.map((userId) => this.users!.find((x) => x.id === userId));
    }
  }

  removeUser(userId: number) {
    const newUserIds = this.issue!.userIds.filter((x) => x !== userId);
    this._projectService.updateIssue({
      ...this.issue!,
      userIds: newUserIds
    });
  }

  addUserToIssue(user: JUser) {
    this._projectService.updateIssue({
      ...this.issue!,
      userIds: [...this.issue!.userIds, user.id]
    });
  }

  isUserSelected(user: JUser): boolean {
    return this.issue!.userIds.includes(user.id);
  }
}
