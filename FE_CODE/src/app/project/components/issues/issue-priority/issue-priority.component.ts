import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { JIssue, IssuePriority } from '@tungle/interface/issue';
import { IssuePriorityIcon } from '@tungle/interface/issue-priority-icon';
import { IssueUtil } from '@tungle/project/utils/issue';
import { ProjectService } from '@tungle/project/state/project/project.service';
import { ProjectConst } from '@tungle/project/config/const';

@Component({
  selector: 'issue-priority',
  templateUrl: './issue-priority.component.html',
  styleUrls: ['./issue-priority.component.scss']
})
export class IssuePriorityComponent implements OnInit, OnChanges {
  @Input() issue: JIssue | undefined;

  selectedPriority: IssuePriority | undefined;
  get selectedPriorityIcon() {
    return IssueUtil.getIssuePriorityIcon(this.selectedPriority!);
  }

  priorities: IssuePriorityIcon[] = [];

  constructor(private _projectService: ProjectService) {}

  ngOnInit() {
    this.priorities = ProjectConst.PrioritiesWithIcon;
  }

  ngOnChanges(): void {
    this.selectedPriority = this.issue?.priority;
  }

  isPrioritySelected(priority: IssuePriority) {
    return priority === this.selectedPriority;
  }

  updateIssue(priority: IssuePriority) {
    this.selectedPriority = priority;
    this._projectService.updateIssue({
      ...this.issue!,
      priority: this.selectedPriority
    });
  }
}
