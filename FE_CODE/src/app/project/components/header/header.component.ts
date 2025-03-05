import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@tungle/core/apis/auth.service';
import {
  IGetAllNotiReq,
  IGetAllNotiRes,
  INoti,
  NotificationService
} from '@tungle/core/apis/notification.service';
import { AuthQuery } from '@tungle/project/auth/auth.query';
import { NzModalService } from 'ng-zorro-antd/modal';
import { jwtDecode } from 'jwt-decode';
import { JwtPayloadWithId } from '@tungle/project/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  totalCountNoti: number = 0;
  listNoti: INoti[] = [];
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    public authQuery: AuthQuery,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.getAllNoti();
    // Lắng nghe thông báo
    const accessToken = localStorage.getItem('accessToken');
    this.notificationService.onTaskNotification((data: INoti) => {
      if (data.user_id === jwtDecode<JwtPayloadWithId>(accessToken!).id || data.user_id === 0) {
        this.listNoti.unshift(data);
        this.totalCountNoti += 1;
      }
    });
  }

  ngOnDestroy() {
    this.notificationService.disconnect();
  }

  async getAllNoti() {
    const accessToken = localStorage.getItem('accessToken');
    const body: IGetAllNotiReq = {
      page: 1,
      pageSize: 99999,
      user_id: jwtDecode<JwtPayloadWithId>(accessToken!).id
    };
    const res = await this.notificationService.getAllNoti(body);
    this.listNoti = res.notis.map((item) => {
      if (item.message === '') {
        const metadataTaskStatus = JSON.parse(item.metadata);

        item.message = `${metadataTaskStatus.nameUserUpdate} vừa đổi trạng thái công việc "${metadataTaskStatus?.taskName}" từ ${metadataTaskStatus.prevStatus} sang ${metadataTaskStatus.currentStatus}`;
        return item;
      }
      return item;
    });
    this.totalCountNoti = res.notis.filter((item) => item.seen === false).length;
  }

  sendNotification(data: INoti) {
    this.notificationService.sendTaskNotification(data);
  }

  logOut() {
    this.authService.logout();
  }
}
