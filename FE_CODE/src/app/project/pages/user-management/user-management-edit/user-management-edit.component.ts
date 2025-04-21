import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { IUploadRes } from '../../../shared/upload/upload.component';
import { UserService } from '@tungle/core/apis/user.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { AuthService } from '@tungle/core/apis/auth.service';
import {
  GENDERS,
  POSITION_LEVEL,
  POSITIONS,
  POSITIONS_1,
  ROLES
} from '@tungle/core/common/user/user';
import { IGender } from '../user-management.component';
import { CommonUserService, ISelect } from '@tungle/core/services/common-user.service';

@Component({
  selector: 'app-user-management-edit',
  templateUrl: './user-management-edit.component.html',
  styleUrls: ['./user-management-edit.component.scss']
})
export class UserManagementEditComponent implements OnInit {
  @Input() mode: 0 | 1 | 2 = 0; // 0: create; 1: update; 2: view
  @Input() userId: number | null = null;
  readonly defaultPassword = '123456';

  genders: IGender[] = GENDERS;
  positions = POSITIONS;
  positions_1 = POSITIONS_1;
  position_level = POSITION_LEVEL;
  roles = ROLES;

  form = new FormGroup({
    id: new FormControl(),
    username: new FormControl(),
    password: new FormControl(),
    fullName: new FormControl(),
    email: new FormControl(),
    dob: new FormControl(),
    sex: new FormControl(),
    avatarUrl: new FormControl(),
    position: new FormControl(),
    position_1: new FormControl(),
    position_level: new FormControl(),
    role: new FormControl('user'),
    start_date: new FormControl()
  });

  isLoading: boolean = false;

  constructor(
    private nzModalRef: NzModalRef,
    private authService: AuthService,
    private notiService: NotiService,
    private userService: UserService,
    private commonUserService: CommonUserService
  ) {}

  async ngOnInit() {
    await this.initView();
  }

  async initView() {
    await this.getUser();

    if (this.mode === 1) {
      this.form.controls['username'].disable();
      this.form.controls['email'].disable();
    }

    if (this.mode === 2) {
      this.form.controls['username'].disable();
      this.form.controls['email'].disable();
      this.form.controls['name'].disable();
      this.form.controls['dob'].disable();
      this.form.controls['sex'].disable();
      this.form.controls['position'].disable();
      this.form.controls['position_1'].disable();
      this.form.controls['position_level'].disable();
      this.form.controls['start_date'].disable();
    }
  }

  async getUser() {
    if (!this.userId) {
      return;
    }
    const res = await this.userService.getAUser(this.userId);
    this.form.patchValue({ ...res });
  }

  async addUser() {
    await this.authService
      .signUp(this.form.getRawValue())
      .then(() => {
        this.notiService.success();
        this.nzModalRef.close(true);
      })
      .catch((err) => {
        this.notiService.error();
      });
  }

  async updateUser() {
    this.form.patchValue({
      id: this.userId,
    });

    await this.userService
      .updateAUser(this.form.getRawValue())
      .then(() => {
        this.notiService.success();
        this.nzModalRef.close(true);
      })
      .catch((err) => {
        this.notiService.error();
      });
  }

  close() {
    this.nzModalRef.close();
  }

  onUpload($event: IUploadRes) {
    this.isLoading = $event.isLoading;
    this.form.patchValue({
      avatarUrl: $event.imgUrl
    });
  }
}
