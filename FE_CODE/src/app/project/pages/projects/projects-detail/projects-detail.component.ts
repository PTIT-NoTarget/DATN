import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGetAProjectRes, ProjectsService } from '@tungle/core/apis/projects.service';
import { IGetAllTaskReq, IGetAllTaskRes, TaskService } from '@tungle/core/apis/task.service';
import { AddIssueModalComponent } from '@tungle/project/components/add-issue-modal/add-issue-modal.component';
import { ProjectService } from '@tungle/project/state/project/project.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'projects-detail',
  templateUrl: './projects-detail.component.html',
  styleUrls: ['./projects-detail.component.scss']
})
export class ProjectsDetailComponent implements OnInit {
  breadcrumbs: string[] = ['Daily', 'Danh sách dự án', 'Chi tiết dự án'];
  projectDetail: IGetAProjectRes | null | undefined;
  projectId: number | undefined;
  allTasks: IGetAllTaskRes | undefined;

  constructor(
    private _projectService: ProjectService,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private taskService: TaskService,
    private nzModalService: NzModalService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.getGroupProjectDetail();
  }

  async getGroupProjectDetail() {
    this.route.paramMap.subscribe(async (params) => {
      const projectId = params.get('id') ?? '';
      if (projectId != '') {
        this.projectId = Number(projectId);
        // this.projectDetail = await this.projectsService.getAProject(this.projectId);
        // await this.getTasksByProjectId();
        this._projectService.getProjectDetail(this.projectId);
      }
    });
  }

  // async getTasksByProjectId() {
  //   const body: IGetAllTaskReq = {
  //     page: 1,
  //     pageSize: 9999,
  //     project_id: this.projectId,
  //     assigned_by: null
  //   };
  //   this.allTasks = await this.taskService.getAllTasks(body);
  //   this.cdr.detectChanges();
  // }

  showModal(): void {
    const modal = this.nzModalService.create({
      nzContent: AddIssueModalComponent,
      nzCentered: true,
      nzFooter: null,
      nzClosable: false,
      nzComponentParams: {
        projectId: this.projectId
      }
    });
    modal.afterClose.subscribe((data) => {
      this._projectService.getProjectDetail(this.projectId!);
    });
  }
}
