import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { JiraControlModule } from '@tungle/jira-control/jira-control.module';

@NgModule({
  declarations: [UserComponent],
  imports: [JiraControlModule],
  exports: [UserComponent],
})
export class SharedUserModule {}
