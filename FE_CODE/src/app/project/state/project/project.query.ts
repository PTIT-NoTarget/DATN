import { ProjectState, ProjectStore } from './project.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { IssueStatus, JIssue } from '@tungle/interface/issue';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JTask } from '@tungle/interface/project';
@Injectable({
  providedIn: 'root'
})
export class ProjectQuery extends Query<ProjectState> {
  isLoading$ = this.selectLoading();
  all$ = this.select();
  issues$ = this.select('issues');
  users$ = this.select('users');
  task$ = this.select('tasks');

  constructor(protected store: ProjectStore) {
    super(store);
  }

  lastIssuePosition = (status: IssueStatus): number => {
    const raw = this.store.getValue();
    const issuesByStatus = raw.issues.filter((x) => x.status === status);
    return issuesByStatus.length;
  };

  issueByStatusSorted$ = (status: IssueStatus): Observable<JIssue[]> =>
    this.issues$.pipe(
      map((issues) =>
        issues.filter((x) => x.status === status).sort((a, b) => a.listPosition - b.listPosition)
      )
    );

  issueById$(issueId: number) {
    return this.issues$.pipe(
      delay(500),
      map((issues) => issues.find((x) => x.id === issueId))
    );
  }

  // by Tung
  getAllTasksByStatus$ = (status: IssueStatus): Observable<JTask[]> => this.task$;

  taskById$(taskId: number) {
    return this.task$.pipe(
      delay(500),
      map((tasks) => tasks.find((x) => x.id === taskId))
    );
  }
}
