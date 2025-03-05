import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JUser } from '@tungle/interface/user';

@Component({
  selector: 'issue-reporter-select',
  templateUrl: './issue-reporter-select.component.html',
  styleUrls: ['./issue-reporter-select.component.scss']
})
export class IssueReporterSelectComponent {
  @Input() control: FormControl = new FormControl(null);
  @Input() users: JUser[] | null = null;

  constructor() {}

  getUser(userId: number) {
    return this.users!.find((user) => user.id === userId);
  }
}
