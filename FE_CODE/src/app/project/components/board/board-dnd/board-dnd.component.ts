import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IssueStatus } from '@tungle/interface/issue';
import { ProjectQuery } from '@tungle/project/state/project/project.query';
import { AuthQuery } from '@tungle/project/auth/auth.query';
import { IGetAllTaskRes } from '@tungle/core/apis/task.service';
@UntilDestroy()
@Component({
  selector: 'board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrls: ['./board-dnd.component.scss']
})
export class BoardDndComponent implements OnInit {
  // @Input() allTasks: IGetAllTaskRes | undefined;

  issueStatuses: IssueStatus[] = [
    IssueStatus.BACKLOG,
    IssueStatus.NEW,
    IssueStatus.IN_PROGRESS,
    // IssueStatus.READY_TO_TEST,
    IssueStatus.TESTING,
    IssueStatus.DONE,
    IssueStatus.REJECT
  ];

  constructor(public projectQuery: ProjectQuery, public authQuery: AuthQuery) {}

  ngOnInit(): void {
    // this.projectQuery.getAllIssueByStatus$(this.issueStatuses[0]).subscribe((data) => {
    //   console.log('getAllIssueByStatus', data);
    // });
  }
}
