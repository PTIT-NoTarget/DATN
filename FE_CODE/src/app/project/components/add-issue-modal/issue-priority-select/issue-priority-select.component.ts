import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IssuePriorityIcon } from '@tungle/interface/issue-priority-icon';
import { IssueUtil } from '@tungle/project/utils/issue';
import { IssuePriority } from '@tungle/interface/issue';
import { ProjectConst } from '@tungle/project/config/const';

@Component({
  selector: 'issue-priority-select',
  templateUrl: './issue-priority-select.component.html',
  styleUrls: ['./issue-priority-select.component.scss']
})
export class IssuePrioritySelectComponent {
  @Input() control: FormControl = new FormControl(null);
  priorities: IssuePriorityIcon[];

  constructor() {
    this.priorities = ProjectConst.PrioritiesWithIcon;
  }

  getPriorityIcon(priority: IssuePriority) {
    return IssueUtil.getIssuePriorityIcon(priority);
  }
}
