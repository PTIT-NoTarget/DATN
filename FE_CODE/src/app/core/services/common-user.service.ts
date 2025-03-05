import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage.service';
import { RequestService } from '../services/requestService.service';

@Injectable({
  providedIn: 'root'
})
export class CommonUserService {
  getNameByCode(arr: ISelect[], code: string): string {
    return arr.find((item) => item.value === code)?.label ?? '';
  }
}

export interface ISelect {
  label: string;
  value: string;
}
