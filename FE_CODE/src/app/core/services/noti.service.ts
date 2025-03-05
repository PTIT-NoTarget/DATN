import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class NotiService {
  constructor(private message: NzMessageService) {}

  success(message?: string) {
    this.message.create('success', message || 'Cập nhật thành công');
  }

  error(message?: string) {
    this.message.create('error', message || 'Cập nhật thất bại');
  }

  warning(message?: string) {
    this.message.create('warning', message || 'Có lỗi xảy ra');
  }
}
