import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayRemove, arrayUpsert, setLoading } from '@datorama/akita';
import { JComment } from '@tungle/interface/comment';
import { JIssue } from '@tungle/interface/issue';
import { JProject } from '@tungle/interface/project';
import { DateUtil } from '@tungle/project/utils/date';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProjectStore } from './project.store';
import {
  IGetAllTaskReq,
  IGetAllTaskRes,
  IUpdateATaskReq,
  TaskService
} from '@tungle/core/apis/task.service';
import { ProjectsService } from '@tungle/core/apis/projects.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { AuthQuery } from '@tungle/project/auth/auth.query';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl: string;
  baseUrl1: string;

  constructor(
    private _http: HttpClient,
    private _store: ProjectStore,
    private _taskService: TaskService,
    private _notiService: NotiService,
    private authQuery: AuthQuery
  ) {
    this.baseUrl = environment.apiUrl;
    this.baseUrl1 = environment.API_URL;
  }

  setLoading(isLoading: boolean) {
    this._store.setLoading(isLoading);
  }

  getProject() {
    this._http
      .get<JProject>(`${this.baseUrl}/project.json`)
      .pipe(
        setLoading(this._store),
        tap((project) => {
          this._store.update((state) => ({
            ...state,
            ...project
          }));
        }),
        catchError((error) => {
          this._store.setError(error);
          return of(error);
        })
      )
      .subscribe();
  }

  updateProject(project: Partial<JProject>) {
    this._store.update((state) => ({
      ...state,
      ...project
    }));
  }

  updateIssue(issue: JIssue) {
    this.authQuery.userId$.subscribe((userId) => {
      const body: IUpdateATaskReq = {
        id: issue.id,
        project_id: issue.projectId,
        name: issue.title,
        description: issue.description,
        label: issue.type,
        status: issue.status,
        start_date: issue.startDate,
        end_date: issue.endDate,
        assigned_by: issue.reporterId,
        created_by: issue.createdBy,
        story_point: issue.storyPoint,
        user_update: userId,
        follower_ids: issue.userIds
      };

      this._http
        .put<IUpdateATaskReq>(`${this.baseUrl1}/api/task/update`, body)
        .pipe(
          setLoading(this._store),
          tap((data) => {
            this._store.update((state) => {
              const issues = arrayUpsert(state.issues, issue.id, issue);
              return {
                ...state,
                issues
              };
            });
            // this._notiService.success();
          }),
          catchError((error) => {
            this._store.setError(error);
            // this._notiService.error();
            return of(error);
          })
        )
        .subscribe();

      // issue.updatedAt = DateUtil.getNow();
      // this._store.update((state) => {
      //   const issues = arrayUpsert(state.issues, issue.id, issue);
      //   return {
      //     ...state,
      //     issues
      //   };
      // });
    });
  }

  deleteIssue(issueId: number) {
    this._store.update((state) => {
      const issues = arrayRemove(state.issues, issueId);
      return {
        ...state,
        issues
      };
    });
  }

  updateIssueComment(issueId: number, comment: JComment) {
    const allIssues = this._store.getValue().issues;
    const issue = allIssues.find((x) => x.id === issueId);
    if (!issue) {
      return;
    }

    const comments = arrayUpsert(issue.comments ?? [], comment.id, comment);
    this.updateIssue({
      ...issue,
      comments
    });
  }

  // by Tung
  getProjectDetail(projectId: number, userId?: number) {
    this._http
      .get<JProject>(`${this.baseUrl1}/api/project/findById/${projectId}`)
      .pipe(
        setLoading(this._store),
        tap((project) => {
          this._store.update((state) => ({
            ...state,
            ...project
          }));
        }),
        switchMap((project) => {
          const body: IGetAllTaskReq = {
            page: 1,
            pageSize: 9999,
            project_id: Number(project.id),
            assigned_by: userId ? userId : null,
          };
          return this._http.post<IGetAllTaskRes>(`${this.baseUrl1}/api/task/getAll`, body).pipe(
            tap((data) => {
              this._store.update((state) => ({
                ...state,
                ...{
                  issues: data.issues.map((item) => {
                    const rec: JIssue = {
                      id: item.id,
                      title: item.title,
                      type: item.type,
                      status: item.status,
                      priority: item.priority,
                      listPosition: item.listPosition,
                      description: item.description,
                      estimate: item.estimate!,
                      timeSpent: item.timeSpent!,
                      timeRemaining: item.timeRemaining!,
                      createdAt: item.createdAt,
                      updatedAt: item.updatedAt,
                      reporterId: item.reporterId,
                      userIds: item.userIds ?? [],
                      comments: item.comments,
                      projectId: item.projectId,
                      startDate: item.startDate,
                      endDate: item.endDate,
                      createdBy: item.createdBy,
                      storyPoint: item.storyPoint
                    };

                    return rec;
                  })
                }
              }));
            })
          );
        }),
        catchError((error) => {
          this._store.setError(error);
          return of(error);
        })
      )
      .subscribe();
  }

  deleteTask(taskId: number) {
    this._store.update((state) => {
      const tasks = arrayRemove(state.tasks, taskId);
      return {
        ...state,
        tasks
      };
    });
  }
}
