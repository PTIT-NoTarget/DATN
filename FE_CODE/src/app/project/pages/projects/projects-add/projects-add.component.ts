import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import {
  IAddAProjectReq,
  IAddMembersReq,
  IUpdateAProjectReq,
  ProjectsService
} from '@tungle/core/apis/projects.service';
import { IGetAllUserReq, UserService } from '@tungle/core/apis/user.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { JUser } from '@tungle/interface/user';
import { AuthQuery } from '@tungle/project/auth/auth.query';
import { DEFAULT_AVATAR_URL } from '@tungle/project/config/icons';
import { ProjectQuery } from '@tungle/project/state/project/project.query';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-projects-add',
  templateUrl: './projects-add.component.html',
  styleUrls: ['./projects-add.component.scss']
})
export class ProjectsAddComponent implements OnInit {
  @Input() users: JUser[] = [];
  @Input() modifyId: number | null = null;

  form = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    start_date: new FormControl(),
    end_date: new FormControl(),
    status: new FormControl(),
    manager_id: new FormControl(),
    image_url: new FormControl()
  });
  selectedUser: JUser | undefined;

  get f() {
    return this.form?.controls as { [key: string]: FormControl };
  }

  constructor(
    private projectsService: ProjectsService,
    private notiService: NotiService,
    private cdr: ChangeDetectorRef,
    private modalRef: NzModalRef,
    private projectQuery: ProjectQuery,
    private userService: UserService,
  ) {}

  async ngOnInit() {
    await this.getProjectData();
  }

  async addProject() {
    const body: IAddAProjectReq = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      start_date: this.form.get('start_date')?.value,
      end_date: this.form.get('end_date')?.value,
      status: 0,
      manager_id: this.form.get('manager_id')?.value ?? null,
      image_url: ''
    };

    await this.projectsService
      .addAProject(body)
      .then((data) => {
        this.notiService.success(data.message);
        this.modalRef.close(1);
      })
      .catch((err) => {
        this.notiService.error();
        this.modalRef.close();
      });
  }

  async getProjectData() {
    if (!this.modifyId) {
      return;
    }

    const res = await this.projectsService.getAProject(this.modifyId);
    if (res) {
      this.form.patchValue({
        name: res.name,
        description: res.description,
        start_date: res.start_date,
        end_date: res.end_date,
        status: res.status,
        manager_id: res.manager_id,
        image_url: res.image_url
      });
    }
  }

  async updateProject() {
    const body: IUpdateAProjectReq = {
      id: this.modifyId!,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      start_date: this.form.get('start_date')?.value,
      end_date: this.form.get('end_date')?.value,
      status: 0,
      manager_id: this.form.get('manager_id')?.value ?? null,
      image_url: ''
    };

    // thêm quản lý vào dự án
    // if (body.manager_id) {
    //   await this.addMembersToProject(this.modifyId!, [body.manager_id]);
    // }

    await this.projectsService
      .updateAProject(body)
      .then((data) => {
        this.notiService.success(data.message);
        this.modalRef.close(1);
      })
      .catch((err) => {
        this.notiService.error();
        this.modalRef.close();
      });
  }

  async addMembersToProject(projectId: number, memberIds: number[]) {
    const body: IAddMembersReq = {
      projectId: projectId,
      userIds: memberIds
    };

    await this.projectsService.addMembersToProject(body);
  }

  handleCancel(): void {
    this.modalRef.close();
  }

  getUser(): JUser {
    return this.users.find((user) => user.id === this.form.get('manager_id')?.value)!;
  }

  getMemberUser(userId: number): JUser {
    return this.users.find((user) => user.id === userId)!;
  }
}
