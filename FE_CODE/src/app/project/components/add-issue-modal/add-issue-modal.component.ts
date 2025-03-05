import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IssueType, JIssue, IssueStatus, IssuePriority } from '@tungle/interface/issue';
import { quillConfiguration } from '@tungle/project/config/editor';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ProjectService } from '@tungle/project/state/project/project.service';
import { IssueUtil } from '@tungle/project/utils/issue';
import { ProjectQuery } from '@tungle/project/state/project/project.query';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { JUser } from '@tungle/interface/user';
import { tap } from 'rxjs/operators';
import { NoWhitespaceValidator } from '@tungle/core/validators/no-whitespace.validator';
import { DateUtil } from '@tungle/project/utils/date';
import { IAddATaskReq, TaskService } from '@tungle/core/apis/task.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { JwtPayloadWithId } from '@tungle/project/auth/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'add-issue-modal',
  templateUrl: './add-issue-modal.component.html',
  styleUrls: ['./add-issue-modal.component.scss']
})
@UntilDestroy()
export class AddIssueModalComponent implements OnInit {
  @Input() projectId: number | undefined;

  reporterUsers$!: Observable<JUser[]>;
  assignees$!: Observable<JUser[]>;
  issueForm!: FormGroup;
  editorOptions = quillConfiguration;

  get f() {
    return this.issueForm?.controls as { [key: string]: FormControl };
  }

  constructor(
    private _fb: FormBuilder,
    private _modalRef: NzModalRef,
    private _projectService: ProjectService,
    private _projectQuery: ProjectQuery,
    private taskService: TaskService,
    private notiService: NotiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.reporterUsers$ = this._projectQuery.users$.pipe(
      untilDestroyed(this),
      tap((users) => {
        const [user] = users;
        if (user) {
          this.f.reporterId.patchValue(user.id);
        }
      })
    );

    this.assignees$ = this._projectQuery.users$;
  }

  initForm() {
    this.issueForm = this._fb.group({
      type: [IssueType.TASK],
      priority: [IssuePriority.HIGHEST],
      title: ['', NoWhitespaceValidator()],
      description: [''],
      reporterId: [''],
      userIds: [[]]
    });
  }

  async submitForm() {
    if (this.issueForm.invalid) {
      return;
    }
    const now = DateUtil.getNow();
    const issue: JIssue = {
      ...this.issueForm.getRawValue(),
      id: IssueUtil.getRandomId(),
      status: IssueStatus.BACKLOG,
      createdAt: now,
      updatedAt: now
    };

    console.log('this.issueForm', this.issueForm.getRawValue());

    const accessToken = localStorage.getItem('accessToken');
    const userId = jwtDecode<JwtPayloadWithId>(accessToken!).id;

    const body: IAddATaskReq = {
      project_id: this.projectId!,
      name: this.issueForm.get('title')?.value,
      description: this.issueForm.get('description')?.value,
      label: this.issueForm.get('type')?.value,
      status: IssueStatus.BACKLOG,
      start_date: null,
      end_date: null,
      assigned_by: this.issueForm.get('reporterId')?.value
        ? Number(this.issueForm.get('reporterId')?.value)
        : null,
      created_by: userId,
      story_point: null,
      follower_ids: this.issueForm.get('userIds')?.value
    };

    console.log('body', body);

    await this.taskService
      .addATask(body)
      .catch((data) => {
        this.notiService.success();
      })
      .catch((err) => this.notiService.error());

    // this._projectService.updateIssue(issue);
    this.closeModal();
  }

  cancel() {
    this.closeModal();
  }

  closeModal() {
    this._modalRef.close();
  }
}
