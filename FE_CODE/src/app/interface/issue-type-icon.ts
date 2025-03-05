import { IssueType } from './issue';
import { IssueUtil } from '@tungle/project/utils/issue';

export class IssueTypeWithIcon {
  value: IssueType;
  icon: string;

  constructor(issueType: IssueType) {
    this.value = issueType;
    this.icon = IssueUtil.getIssueTypeIcon(issueType);
  }
}
