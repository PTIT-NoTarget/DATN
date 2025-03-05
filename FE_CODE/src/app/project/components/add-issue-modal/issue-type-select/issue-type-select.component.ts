import { Component, Input } from '@angular/core';
import { IssueType } from '@tungle/interface/issue';
import { IssueUtil } from '@tungle/project/utils/issue';
import { IssueTypeWithIcon } from '@tungle/interface/issue-type-icon';
import { FormControl } from '@angular/forms';
import { ProjectConst } from '@tungle/project/config/const';

@Component({
  selector: 'issue-type-select',
  templateUrl: './issue-type-select.component.html',
  styleUrls: ['./issue-type-select.component.scss']
})
export class IssueTypeSelectComponent {
  @Input() control: FormControl = new FormControl(null);

  issueTypes: IssueTypeWithIcon[];

  constructor() {
    this.issueTypes = ProjectConst.IssueTypesWithIcon;
  }

  getIssueTypeIcon(issueType: IssueType) {
    return IssueUtil.getIssueTypeIcon(issueType);
  }
}
