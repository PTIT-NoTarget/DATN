import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentManagementComponent } from './department-management.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentManagementComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentManagementRoutingModule {}
