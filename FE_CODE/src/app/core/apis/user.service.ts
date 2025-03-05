import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';
import { RequestService } from '../services/requestService.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public apiUrl = environment.API_URL + '/api/user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private requestService: RequestService
  ) {}

  getAllUser(body: IGetAllUserReq): Promise<IGetAllUserRes> {
    return this.requestService
      .jsonRequestWithLoading<IGetAllUserReq>('POST', this.apiUrl + '/getAll', body)
      .toPromise();
  }

  getAUser(id: number): Promise<IGetAUserRes | null | undefined> {
    return this.requestService
      .getJsonRequestWithLoading<IGetAUserRes>(this.apiUrl + '/findById', [id])
      .toPromise();
  }

  updateAUser(body: IUpdateAUserReq): Promise<IUpdateAUserRes> {
    return this.requestService
      .jsonRequestWithLoading<IUpdateAUserReq>('PUT', this.apiUrl + '/update', body)
      .toPromise();
  }

  deleteAUser(body: IDeleteAUserReq): Promise<IDeleteAUserRes> {
    return this.requestService
      .jsonRequestWithLoading<IDeleteAUserReq>('DELETE', this.apiUrl + '/delete', body)
      .toPromise();
  }
}

export interface IGetAllUserReq {
  page: number;
  pageSize: number;
}

export interface IGetAllUserRes {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  users: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    sex: string;
    dob: string;
    phoneNumber: string;
    address: string;
    position: string;
    avatarUrl: string;
    role: string;
    position_1: string | null;
    position_level: string | null;
    start_date: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface IGetAUserRes {
  id: number;
  username: string;
  email: string;
  fullName: string;
  sex: string;
  dob: string;
  phoneNumber: string;
  address: string;
  position: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateAUserReq {
  id: number;
  fullName: string;
  sex: string;
  dob: string;
  address: string | null;
  position: string | null;
  avatarUrl: string | null;
  role: string | null;
}

export interface IUpdateAUserRes {
  success: boolean;
  message: string;
}

export interface IDeleteAUserReq {
  id: number;
}

export interface IDeleteAUserRes {
  success: boolean;
  message: string;
}
