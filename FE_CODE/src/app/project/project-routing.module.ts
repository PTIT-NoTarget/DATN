import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './pages/board/board.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProjectComponent } from './project.component';
import { ProjectConst } from './config/const';
import { FullIssueDetailComponent } from './pages/full-issue-detail/full-issue-detail.component';
import { AuthGuard } from '@tungle/core/guards/auth.guard';
import { ProjectsComponent } from './pages/projects/projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../../app/project/pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('../../app/project/pages/projects/projects.module').then((m) => m.ProjectsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../../app/project/pages/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../../app/project/pages/profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'department-management',
        loadChildren: () =>
          import('../../app/project/pages/department-management/department-management.module').then(
            (m) => m.DepartmentManagementModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'noti-management',
        loadChildren: () =>
          import('../../app/project/pages/noti-management/noti-management.module').then(
            (m) => m.NotiManagementModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'my-works',
        loadChildren: () =>
          import('../../app/project/pages/my-works/my-works.module').then(
            (m) => m.MyWorksModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'board',
        component: BoardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: `issue/:${ProjectConst.IssueId}`,
        component: FullIssueDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
