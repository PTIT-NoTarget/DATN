import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'app-sort-table',
  templateUrl: './sort-table.component.html',
  styleUrls: ['./sort-table.component.scss']
})
export class SortTableComponent implements OnInit {
  @Input() colTitle!: IColumnSort[];
  @Input() data!: any;
  @Input() loaded!: boolean | null;
  @Input() total!: number;
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @ContentChild('rows') rows!: TemplateRef<any>;

  ngOnInit(): void {}

  onPageSizeChange($event: number) {
    this.pageSizeChange.emit($event);
  }
}

export interface IColumnSort {
  title: string;
  compare: any;
  priority: number | boolean;
}
