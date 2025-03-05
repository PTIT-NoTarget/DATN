import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { UploadComponent } from './upload/upload.component';
import { SortTableComponent } from './sort-table/sort-table.component';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@NgModule({
  declarations: [UploadComponent, SortTableComponent],
  imports: [
    CommonModule,
    NzTableModule,
    NzUploadModule,
    NzIconModule,
    NzSpinModule,
    NzPaginationModule
  ],
  exports: [UploadComponent, SortTableComponent]
})
export class SharedModule {}
