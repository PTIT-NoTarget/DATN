import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@tungle/core/apis/auth.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { StorageEnum, StorageService } from '@tungle/core/services/storage.service';
import { AuthStore } from '@tungle/project/auth/auth.store';
import { ProjectService } from '@tungle/project/state/project/project.service';
import { ProjectStore } from '@tungle/project/state/project/project.store';
// import { AuthService } from 'src/app/core/api/auth.service';
// import { StorageConstant } from 'src/app/core/enums/storage.enum';
// import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public form: FormGroup = this.fb.group({
    username: [null],
    password: [null]
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private projectService: ProjectService,
    private storageService: StorageService,
    private notiService: NotiService,
    private store: ProjectStore
  ) {
    this.projectService.setLoading(false);
  }

  ngOnInit() {}

  async login() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const res = await this.authService
      .login(this.form.value)
      .then((data) => {
        this.storageService.setLocalStorage(StorageEnum.accessToken, data.accessToken);
        this.router.navigate(['/main']);
      })
      .catch((err) => {
        this.store.setLoading(false);
        this.notiService.error('Tài khoản hoặc mật khẩu không đúng');
      });
  }
}
