import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { RequestService } from '../services/requestService.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  apiUrl: string = environment.API_URL + '/api/notification';
  private socket: Socket;

  constructor(private requestService: RequestService) {
    // Kết nối tới server Node.js
    this.socket = io(environment.API_URL);
  }

  // Gửi thông báo
  sendTaskNotification(data: INoti) {
    this.socket.emit('taskNotification', data);
  }

  // Lắng nghe thông báo
  onTaskNotification(callback: (data: INoti) => void) {
    this.socket.on('taskNotification', callback);
  }

  // Ngắt kết nối
  disconnect() {
    this.socket.disconnect();
  }

  getAllNoti(body: IGetAllNotiReq): Promise<IGetAllNotiRes> {
    return this.requestService
      .jsonRequestWithLoading<IGetAllNotiReq>('POST', this.apiUrl + '/getAll', body)
      .toPromise();
  }

  getANoti(id: number): Promise<any> {
    return this.requestService
      .getJsonRequestWithLoading<any>(this.apiUrl + '/findById', [id])
      .toPromise();
  }

  addANoti(body: any): Promise<any> {
    return this.requestService
      .jsonRequestWithLoading<any>('POST', this.apiUrl + '/add', body)
      .toPromise();
  }

  deleteANoti(body: any): Promise<any> {
    return this.requestService
      .jsonRequestWithLoading<any>('DELETE', this.apiUrl + '/delete', body)
      .toPromise();
  }
}

export interface IGetAllNotiReq {
  page: number;
  pageSize: number;
  user_id: number;
}

export interface IGetAllNotiRes {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  notis: INoti[];
}

export interface INoti {
  id: number;
  user_id: number;
  title: string;
  message: string;
  seen: boolean;
  metadata: string;
  createdAt: string;
  updatedAt: string;
}
