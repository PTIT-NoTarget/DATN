import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  public clearStorage() {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }

  public setSessionStorage(key: string, value: string) {
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, value);
  }
  public getSessionStorage(key: any): any {
    return window.sessionStorage.getItem(key);
  }

  public setLocalStorage(key: string, value: string) {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }
  public getLocalStorage(key: string): any {
    return window.localStorage.getItem(key);
  }
}

export enum StorageEnum {
  accessToken = 'accessToken',
}
