import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JProject } from '@tungle/interface/project';
import { SideBarLink } from '@tungle/interface/ui-model/nav-link';
import { AuthQuery } from '@tungle/project/auth/auth.query';
import { SideBarLinks } from '@tungle/project/config/sidebar';
import { ProjectQuery } from '@tungle/project/state/project/project.query';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
@UntilDestroy()
export class SidebarComponent implements OnInit {
  @Input() expanded: boolean = true;
  listNoti: any[] = [];
  totalCountNoti: number = 0;

  get sidebarWidth(): number {
    return this.expanded ? 240 : 15;
  }

  project!: JProject;
  sideBarLinks: SideBarLink[] = [];

  constructor(private _projectQuery: ProjectQuery, public authQuery: AuthQuery) {
    this._projectQuery.all$.pipe(untilDestroyed(this)).subscribe((project) => {
      console.log('project', project);
      this.project = project;
    });
  }

  checkUserCanAccessRoute(route: string, role: string): boolean {
    if (
      ['dashboard', 'user-management', 'department-management', 'noti-management'].includes(
        route
      ) &&
      role === 'user'
    ) {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    this.sideBarLinks = SideBarLinks;
  }
}
