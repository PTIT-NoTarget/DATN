import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IssueType, JIssue } from '@tungle/interface/issue';
import { IssueTypeWithIcon } from '@tungle/interface/issue-type-icon';
import { ProjectService } from '@tungle/project/state/project/project.service';
import { IssueUtil } from '@tungle/project/utils/issue';
import { ProjectConst } from '@tungle/project/config/const';

@Component({
  selector: 'issue-type',
  templateUrl: './issue-type.component.html',
  styleUrls: ['./issue-type.component.scss']
})
export class IssueTypeComponent implements OnInit, OnChanges {
  @Input() issue: JIssue | undefined;

  get selectedIssueTypeIcon(): string {
    return IssueUtil.getIssueTypeIcon(this.issue?.type!);
  }

  issueTypes: IssueTypeWithIcon[];

  constructor(private _projectService: ProjectService) {
    this.issueTypes = ProjectConst.IssueTypesWithIcon;
  }

  ngOnInit() {}

  ngOnChanges(): void {}

  updateIssue(issueType: IssueType) {
    this._projectService.updateIssue({
      ...this.issue!,
      type: issueType
    });
  }

  isTypeSelected(type: IssueType) {
    return this.issue?.type === type;
  }
}
