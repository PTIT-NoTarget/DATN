import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotiService } from '@tungle/core/services/noti.service';
import { JUser } from '@tungle/interface/user';
import { IGetAllUserReq, UserService } from '@tungle/core/apis/user.service';
import { DEFAULT_AVATAR_URL, DEFAULT_EMPTY_AVATAR_URL } from '@tungle/project/config/icons';
import {
  IDeleteAProjectReq,
  IGetAllProjectReq,
  IGetAllProjectRes,
  ProjectsService
} from '@tungle/core/apis/projects.service';
import { ProjectsAddComponent } from '../projects-add/projects-add.component';
import { ProjectsMembersAddComponent } from '../projects-members-add/projects-members-add.component';
import { AuthQuery } from '@tungle/project/auth/auth.query';

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  breadcrumbs: string[] = ['Daily', 'Danh sách dự án'];
  projects: IGetAllProjectRes | undefined;
  users: JUser[] = [];

  constructor(
    private projectsService: ProjectsService,
    private nzModalService: NzModalService,
    private cdr: ChangeDetectorRef,
    private notiService: NotiService,
    private userService: UserService,
    public authQuery: AuthQuery
  ) {}

  async ngOnInit() {
    this.authQuery.role$.subscribe((role) => {
      console.log('role', role);
    });
    await this.getAllProjects();
    await this.getAllUsers();
  }

  async getAllProjects() {
    this.authQuery.user$.subscribe(async (user) => {
      const body: IGetAllProjectReq = {
        page: 1,
        pageSize: 10,
        userId: user.role === 'user' ? user.id : null
      };
      this.projects = await this.projectsService.getAllProject(body);
      this.cdr.detectChanges();
    });
  }

  showAddProjectModal(projectId?: number): void {
    const modal = this.nzModalService.create({
      nzContent: ProjectsAddComponent,
      nzCentered: true,
      nzFooter: null,
      nzComponentParams: {
        users: this.users,
        modifyId: projectId ? projectId : null
      }
    });
    modal.afterClose.subscribe((data) => {
      if (data) {
        this.getAllProjects();
      }
    });
  }

  showAddMembersModal(projectId: number, manager_id: number | null): void {
    const modal = this.nzModalService.create({
      nzContent: ProjectsMembersAddComponent,
      nzCentered: true,
      nzFooter: null,
      nzComponentParams: {
        users: this.users,
        projectId: projectId,
        manager_id: manager_id ?? -1
      }
    });
    modal.afterClose.subscribe((data) => {
      if (data) {
        this.getAllProjects();
      }
    });
  }

  async deleteProject(id: number) {
    const body: IDeleteAProjectReq = {
      id: id
    };
    const res = await this.projectsService.deleteAProject(body);
    if (res && res.success === true) {
      this.notiService.success(res.message);
      await this.getAllProjects();
    } else {
      this.notiService.error();
    }
  }

  async getAllUsers() {
    const body: IGetAllUserReq = {
      page: 1,
      pageSize: 9999
    };

    const res = await this.userService.getAllUser(body);
    const users = res.users ?? [];
    this.users = users.map((item) => {
      const rec: JUser = {
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        avatarUrl: item.avatarUrl ?? DEFAULT_AVATAR_URL,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
        // issueIds: []
      };
      return rec;
    });
  }

  getManagerInfo(managerId: number | null) {
    const emptyManagerData: JUser = {
      id: -1,
      fullName: 'Chưa có quản lý',
      email: '',
      avatarUrl: DEFAULT_EMPTY_AVATAR_URL,
      createdAt: '',
      updatedAt: ''
      // issueIds: []
    };

    if (!managerId) {
      return emptyManagerData;
    }

    const user = this.users.find((item) => item.id === managerId);
    if (!user) {
      return emptyManagerData;
    }

    return user;
  }

  getAbbreviatedName(name: string | null): string {
    if (!name || name.trim() === '') {
      return '';
    }

    let result = '';

    const nameArr = name.trim().split(' ');
    if (nameArr.length === 1) {
      result = nameArr[0][0];
    } else {
      result = nameArr[0][0] + nameArr[1][0];
    }

    return result.toUpperCase();
  }
}
