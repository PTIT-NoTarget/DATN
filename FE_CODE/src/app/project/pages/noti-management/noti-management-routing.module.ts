import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotiManagementComponent } from './noti-management.component';

const routes: Routes = [
  {
    path: '',
    component: NotiManagementComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotiManagementRoutingModule {}
