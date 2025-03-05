import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JIssue } from '@tungle/interface/issue';
import { ProjectService } from '@tungle/project/state/project/project.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { DeleteIssueModel } from '@tungle/interface/ui-model/delete-issue-model';
import { JTask } from '@tungle/interface/project';

@Component({
  selector: 'issue-modal',
  templateUrl: './issue-modal.component.html',
  styleUrls: ['./issue-modal.component.scss']
})
export class IssueModalComponent {
  @Input() issue$!: Observable<JIssue | undefined>;

  constructor(
    private _modal: NzModalRef,
    private _router: Router,
    private _projectService: ProjectService
  ) {}

  ngOnInit() {}

  closeModal() {
    this._modal.close();
  }

  openIssuePage(issueId: number) {
    this.closeModal();
    this._router.navigate(['project', 'issue', issueId]);
  }

  deleteIssue({ issueId, deleteModalRef }: DeleteIssueModel) {
    this._projectService.deleteIssue(issueId);
    deleteModalRef.close();
    this.closeModal();
  }
}
