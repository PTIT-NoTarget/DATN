import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';
import { RequestService } from '../services/requestService.service';
import { ProjectStore } from '@tungle/project/state/project/project.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL + '/api/v1';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private requestService: RequestService
  ) {}

  login(body: ILoginReq): Promise<ILoginRes> {
    return this.requestService
      .jsonRequestWithLoading<ILoginReq>('POST', this.apiUrl + '/signin', body)
      .toPromise();
  }

  signUp(body: ISignUpReq): Promise<ISignUpRes> {
    return this.requestService
      .jsonRequestWithLoading<ISignUpReq>('POST', this.apiUrl + '/signup', body)
      .toPromise();
  }

  logout(): void {
    this.storageService.clearStorage();
    this.router.navigate(['/auth/login']);
  }
}

export interface ILoginReq {
  username: string;
  password: string;
}

export interface ILoginRes {
  id: number;
  username: string;
  email: string;
  accessToken: string;
}

export interface ISignUpReq {
  username: string;
  email: string;
  password: string;
  fullName: string | null;
  sex: string | null;
  dob: string | null;
  phoneNumber: string | null;
  address: string | null;
  position: string | null;
  avatarUrl: string | null;
  role: string | null;
}

export interface ISignUpRes {
  message: string;
}
