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
export class DepartmentsService {
  public apiUrl = environment.API_URL + '/api/department';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private requestService: RequestService
  ) {}

  getAllDepartment(body: IGetAllDepartmentReq): Promise<IGetAllDepartmentRes> {
    return this.requestService
      .jsonRequestWithLoading<IGetAllDepartmentReq>('POST', this.apiUrl + '/getAll', body)
      .toPromise();
  }

  getADepartment(id: number): Promise<IGetADepartmentRes | null | undefined> {
    return this.requestService
      .getJsonRequestWithLoading<IGetADepartmentRes>(this.apiUrl + '/findById', [id])
      .toPromise();
  }

  addADepartment(body: IAddADepartmentReq): Promise<IAddADepartmentRes> {
    return this.requestService
      .jsonRequestWithLoading<IAddADepartmentReq>('POST', this.apiUrl + '/add', body)
      .toPromise();
  }

  updateADepartment(body: IUpdateADepartmentReq): Promise<IUpdateADepartmentRes> {
    return this.requestService
      .jsonRequestWithLoading<IUpdateADepartmentReq>('PUT', this.apiUrl + '/update', body)
      .toPromise();
  }

  deleteADepartment(body: IDeleteADepartmentReq): Promise<IDeleteADepartmentRes> {
    return this.requestService
      .jsonRequestWithLoading<IDeleteADepartmentReq>('DELETE', this.apiUrl + '/delete', body)
      .toPromise();
  }

  addMembersToDepartment(body: IAddMembersReq): Promise<IAddMembersRes> {
    return this.requestService
      .jsonRequestWithLoading<IAddMembersReq>('POST', this.apiUrl + '/addUsers', body)
      .toPromise();
  }

  deleteMemberFromDepartment(
    body: IDeleteMemberFromDepartmentReq
  ): Promise<IDeleteMemberFromDepartmentRes> {
    return this.requestService
      .jsonRequestWithLoading<IDeleteMemberFromDepartmentReq>(
        'DELETE',
        this.apiUrl + '/deleteUser',
        body
      )
      .toPromise();
  }
}

export interface IGetAllDepartmentReq {
  page: number;
  pageSize: number;
  name: string | null;
  description: string | null;
  manager_id: string | null;
}

export interface IGetAllDepartmentRes {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  departments: {
    id: number;
    name: string | null;
    description: string | null;
    manager_id: number | null;
    createdAt: string;
    updatedAt: string;
    users: any[];
  }[];
}

export interface IGetADepartmentRes {
  id: number;
  name: string | null;
  description: string | null;
  manager_id: number | null;
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

export interface IAddADepartmentReq {
  id: number;
  name: string | null;
  description: string | null;
  manager_id: number;
}

export interface IAddADepartmentRes {
  message: string;
}

export interface IUpdateADepartmentReq extends IAddADepartmentReq {
  id: number;
}
export interface IUpdateADepartmentRes extends IAddADepartmentRes {}

export interface IDeleteADepartmentReq {
  id: number;
}

export interface IDeleteADepartmentRes {
  success: boolean;
  message: string;
}

export interface IAddMembersReq {
  departmentId: number;
  userIds: number[];
}

export interface IAddMembersRes {
  message: string;
}

export interface IDeleteMemberFromDepartmentReq {
  departmentId: number;
  userId: number;
}

export interface IDeleteMemberFromDepartmentRes {
  message: string;
}
