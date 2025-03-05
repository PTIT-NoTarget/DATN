import { Component, Input } from '@angular/core';
import { JIssue } from '@tungle/interface/issue';
import { IssueUtil } from '@tungle/project/utils/issue';

@Component({
  selector: 'issue-result',
  templateUrl: './issue-result.component.html',
  styleUrls: ['./issue-result.component.scss']
})
export class IssueResultComponent {
  @Input() issue: JIssue | undefined;

  get issueTypeIcon() {
    return IssueUtil.getIssueTypeIcon(this.issue?.type!);
  }

  constructor() {}
}
