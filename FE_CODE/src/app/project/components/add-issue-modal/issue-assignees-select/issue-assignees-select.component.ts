import { Component, Input, ViewEncapsulation } from '@angular/core';
import { JUser } from '@tungle/interface/user';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'issue-assignees-select',
  templateUrl: './issue-assignees-select.component.html',
  styleUrls: ['./issue-assignees-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IssueAssigneesSelectComponent {
  @Input() control: FormControl = new FormControl(null);
  @Input() users: JUser[] | null = null;

  constructor() {}

  getUser(userId: number): any {
    return this.users!.find((user) => user.id === userId);
  }
}
