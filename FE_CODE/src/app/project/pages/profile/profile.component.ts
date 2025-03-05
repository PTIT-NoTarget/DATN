import { Component } from '@angular/core';
import { IUpdateAUserReq, UserService } from '@tungle/core/apis/user.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { AuthQuery } from '@tungle/project/auth/auth.query';
import { AuthService } from '@tungle/project/auth/auth.service';
import { IUploadRes } from '@tungle/project/shared/upload/upload.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(
    public authQuery: AuthQuery,
    private userService: UserService,
    private notiService: NotiService,
    private _authService: AuthService
  ) {}

  ngOnInit() {}

  updateUser($event: IUploadRes) {
    if ($event.isLoading === false) {
      this.authQuery.user$.pipe(take(1)).subscribe(async (user) => {
        const body: IUpdateAUserReq = {
          id: user.id,
          fullName: user.fullName,
          sex: user.sex!,
          dob: user.dob!,
          address: user.address!,
          position: user.position!,
          avatarUrl: $event.imgUrl,
          role: user.role!
        };

        await this.userService
          .updateAUser(body)
          .then(() => {
            this._authService.getUser();
            // this.notiService.success();
          })
          .catch((err) => {
            this.notiService.error();
          });
      });
    }
  }
}
