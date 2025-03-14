import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { JIssue } from '@tungle/interface/issue';
import { ProjectService } from '@tungle/project/state/project/project.service';

@Component({
  selector: 'issue-title',
  templateUrl: './issue-title.component.html',
  styleUrls: ['./issue-title.component.scss']
})
export class IssueTitleComponent implements OnChanges {
  @Input() issue: JIssue | undefined;
  titleControl: FormControl = new FormControl('');

  constructor(private _projectService: ProjectService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const issueChange = changes.issue;
    if (issueChange.currentValue !== issueChange.previousValue) {
      this.titleControl = new FormControl(this.issue?.title);
    }
  }

  onBlur() {
    this._projectService.updateIssue({
      ...this.issue!,
      title: this.titleControl.value
    });
  }
}
