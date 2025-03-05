import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';
import { RequestService } from '../services/requestService.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  public apiUrl = environment.API_URL + '/api/project';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private requestService: RequestService
  ) {}

  getAllProject(body: IGetAllProjectReq): Promise<IGetAllProjectRes> {
    return this.requestService
      .jsonRequestWithLoading<IGetAllProjectReq>('POST', this.apiUrl + '/getAll', body)
      .toPromise();
  }

  getAProject(id: number): Promise<IGetAProjectRes | null | undefined> {
    return this.requestService
      .getJsonRequestWithLoading<IGetAProjectRes>(this.apiUrl + '/findById', [id])
      .toPromise();
  }

  addAProject(body: IAddAProjectReq): Promise<IAddAProjectRes> {
    return this.requestService
      .jsonRequestWithLoading<IAddAProjectReq>('POST', this.apiUrl + '/add', body)
      .toPromise();
  }

  updateAProject(body: IUpdateAProjectReq): Promise<IUpdateAProjectRes> {
    return this.requestService
      .jsonRequestWithLoading<IUpdateAProjectReq>('PUT', this.apiUrl + '/update', body)
      .toPromise();
  }

  deleteAProject(body: IDeleteAProjectReq): Promise<IDeleteAProjectRes> {
    return this.requestService
      .jsonRequestWithLoading<IDeleteAProjectReq>('DELETE', this.apiUrl + '/delete', body)
      .toPromise();
  }

  addMembersToProject(body: IAddMembersReq): Promise<IAddMembersRes> {
    return this.requestService
      .jsonRequestWithLoading<IAddMembersReq>('POST', this.apiUrl + '/addUsers', body)
      .toPromise();
  }

  deleteMemberFromProject(body: IDeleteMemberFromProjectReq): Promise<IDeleteMemberFromProjectRes> {
    return this.requestService
      .jsonRequestWithLoading<IDeleteMemberFromProjectReq>('DELETE', this.apiUrl + '/deleteUser', body)
      .toPromise();
  }
}

export interface IGetAllProjectReq {
  page: number;
  pageSize: number;
  userId: number | null;
}

export interface IGetAllProjectRes {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  projects: {
    id: number;
    name: string | null;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    status: number | null;
    manager_id: number | null;
    image_url: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface IGetAProjectRes {
  id: number;
  name: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  status: number | null;
  manager_id: number | null;
  image_url: string | null;
  createdAt: string;
  updatedAt: string;
  users: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    sex: string;
    dob: string | null;
    phoneNumber: string | null;
    address: string | null;
    position: string | null;
    avatarUrl: string;
    role: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface IAddAProjectReq {
  name: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  status: number;
  manager_id: number | null;
  image_url: string;
}

export interface IAddAProjectRes {
  message: string;
}

export interface IUpdateAProjectReq extends IAddAProjectReq {
  id: number;
}
export interface IUpdateAProjectRes extends IAddAProjectRes {}

export interface IDeleteAProjectReq {
  id: number;
}

export interface IDeleteAProjectRes {
  success: boolean;
  message: string;
}

export interface IAddMembersReq {
  projectId: number;
  userIds: number[];
}

export interface IAddMembersRes {
  message: string;
}

export interface IDeleteMemberFromProjectReq {
  projectId: number;
  userId: number;
}

export interface IDeleteMemberFromProjectRes {
  message: string;
}
