import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyWorksComponent } from './my-works.component';

const routes: Routes = [
  {
    path: '',
    component: MyWorksComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyWorksRoutingModule {}
