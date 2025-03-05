import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';
import { RequestService } from '../services/requestService.service';
import { IssuePriority, IssueStatus, IssueType } from '@tungle/interface/issue';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public apiUrl = environment.API_URL + '/api/task';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private requestService: RequestService
  ) {}

  getAllTasks(body: IGetAllTaskReq): Promise<IGetAllTaskRes> {
    return this.requestService
      .jsonRequestWithLoading<IGetAllTaskReq>('POST', this.apiUrl + '/getAll', body)
      .toPromise();
  }

  addATask(body: IAddATaskReq): Promise<IAddATaskRes> {
    return this.requestService
      .jsonRequestWithLoading<IAddATaskReq>('POST', this.apiUrl + '/add', body)
      .toPromise();
  }

  deleteATask(body: IDeleteATaskReq): Promise<IDeleteATaskRes> {
    return this.requestService
      .jsonRequestWithLoading<IDeleteATaskReq>('DELETE', this.apiUrl + '/delete', body)
      .toPromise();
  }
}

export interface IGetAllTaskReq {
  page: number;
  pageSize: number;
  project_id: number | null;
  assigned_by: number | null;
}

export interface IGetAllTaskRes {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  issues: {
    id: number;
    title: string;
    type: IssueType;
    status: IssueStatus;
    priority: IssuePriority;
    listPosition: number;
    description: string;
    estimate: number | null;
    timeSpent: number | null;
    timeRemaining: number | null;
    createdAt: string;
    updatedAt: string;
    reporterId: number;
    userIds: number[];
    comments: any[];
    projectId: number;
    //
    startDate: string | null;
    endDate: string | null;
    createdBy: number;
    storyPoint: number | null;
  }[];
}

export interface IAddATaskReq {
  project_id: number;
  name: string;
  description: string;
  label: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  assigned_by: number | null;
  created_by: number;
  story_point: number | null;
  follower_ids: number[] | null;
}

export interface IAddATaskRes {
  message: string;
}

export interface IDeleteATaskReq {
  id: number;
}

export interface IDeleteATaskRes {
  success: boolean;
  message: string;
}

export interface IUpdateATaskReq {
  id: number;
  project_id: number;
  name: string;
  description: string;
  label: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  assigned_by: number | null;
  created_by: number;
  story_point: number | null;
  user_update: number;
  follower_ids: number[] | null;
}
