import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { JiraControlModule } from "../../../jira-control/jira-control.module";
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    NzDropDownModule,
    JiraControlModule,
    RouterModule
],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
