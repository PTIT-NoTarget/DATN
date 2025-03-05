import { Component, Input, OnInit } from '@angular/core';
import {
  IAddMembersReq,
  IDeleteMemberFromProjectReq,
  ProjectsService
} from '@tungle/core/apis/projects.service';
import { NotiService } from '@tungle/core/services/noti.service';
import { JUser } from '@tungle/interface/user';

@Component({
  selector: 'projects-members-add',
  templateUrl: './projects-members-add.component.html',
  styleUrls: ['./projects-members-add.component.scss']
})
export class ProjectsMembersAddComponent implements OnInit {
  @Input() users: JUser[] = [];
  @Input() projectId!: number;
  @Input() manager_id: number = -1;

  selectedUserId: number = -1;
  listMember: JUser[] = [];

  constructor(private projectsService: ProjectsService, private notiService: NotiService) {}

  async ngOnInit() {
    await this.getListMembers();
  }

  getListUser() {
    return this.users.filter((user) => !this.listMember.find((item) => item.id === user.id));
  }

  getMemberUser(userId: number): JUser {
    return this.users.find((user) => user.id === userId)!;
  }

  getMemberSelected(): JUser[] {
    return this.users.filter((user) => Number(user.id) === this.selectedUserId);
  }

  async addMembersToProject() {
    const body: IAddMembersReq = {
      projectId: this.projectId,
      userIds: [this.selectedUserId]
    };

    await this.projectsService
      .addMembersToProject(body)
      .then(async (data) => {
        await this.getListMembers();
        this.selectedUserId = -1;
        // this.notiService.success();
      })
      .catch((err) => this.notiService.error());
  }

  async getListMembers() {
    let res = await this.projectsService.getAProject(this.projectId);

    // thêm quản lý vào dự án
    if (this.manager_id !== -1 && !res?.users.find((item) => item.id === this.manager_id)) {
      this.selectedUserId = this.manager_id;
      await this.addMembersToProject();
      res = await this.projectsService.getAProject(this.projectId);
    }

    this.listMember =
      res?.users.map((item) => {
        const rec: JUser = {
          id: item.id,
          fullName: item.fullName,
          email: item.email,
          avatarUrl: item.avatarUrl,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
          // issueIds: []
        };

        return rec;
      }) ?? [];
  }

  async deleteMember(userId: number) {
    const body: IDeleteMemberFromProjectReq = {
      projectId: this.projectId,
      userId: userId
    };

    await this.projectsService
      .deleteMemberFromProject(body)
      .then(async (data) => {
        await this.getListMembers();
        this.notiService.success();
      })
      .catch((err) => this.notiService.error());
  }
}
