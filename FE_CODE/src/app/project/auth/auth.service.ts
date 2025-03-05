import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JUser } from '@tungle/interface/user';
import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthStore } from './auth.store';
import { environment } from 'src/environments/environment';
import { LoginPayload } from '@tungle/project/auth/loginPayload';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string;
  constructor(private _http: HttpClient, private _store: AuthStore) {
    this.baseUrl = environment.API_URL + '/api/user';
  }

  getUser() {
    this._store.setLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    const userId = jwtDecode<JwtPayloadWithId>(accessToken!).id;
    this._http
      .get<JUser>(`${this.baseUrl}/findById/${userId}`)
      .pipe(
        map((user) => {
          this._store.update((state) => ({
            ...state,
            ...user
          }));
        }),
        finalize(() => {
          this._store.setLoading(false);
        }),
        catchError((err) => {
          this._store.setError(err);
          return of(err);
        })
      )
      .subscribe();
  }
}

export interface JwtPayloadWithId {
  id: number;
}
