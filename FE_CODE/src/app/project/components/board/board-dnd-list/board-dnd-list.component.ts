import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {
  IssuePriority,
  IssueStatus,
  IssueStatusDisplay,
  IssueType,
  JIssue
} from '@tungle/interface/issue';
import { FilterState } from '@tungle/project/state/filter/filter.store';
import { ProjectService } from '@tungle/project/state/project/project.service';
import { Observable, combineLatest } from 'rxjs';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { FilterQuery } from '@tungle/project/state/filter/filter.query';
import * as dateFns from 'date-fns';
import { IssueUtil } from '@tungle/project/utils/issue';
import { IGetAllTaskRes } from '@tungle/core/apis/task.service';
import { JTask } from '@tungle/interface/project';

@Component({
  selector: '[board-dnd-list]',
  templateUrl: './board-dnd-list.component.html',
  styleUrls: ['./board-dnd-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@UntilDestroy()
export class BoardDndListComponent implements OnInit {
  @Input() status: IssueStatus | undefined;
  @Input() currentUserId: number | null = null;
  @Input() issues$: Observable<JIssue[]> | undefined;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  IssueStatusDisplay = IssueStatusDisplay;
  issues: JIssue[] = [];

  get issuesCount(): number {
    return this.issues.length;
  }

  constructor(
    private _projectService: ProjectService,
    private _filterQuery: FilterQuery,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    combineLatest([this.issues$!, this._filterQuery.all$])
      .pipe(untilDestroyed(this))
      .subscribe(([issues, filter]) => {
        this.issues = this.filterIssues(issues, filter);
      });
  }

  drop(event: CdkDragDrop<JIssue[]>) {
    const newIssue: JIssue = { ...event.item.data };
    const newIssues = [...event.container.data];
    if (event.previousContainer === event.container) {
      moveItemInArray(newIssues, event.previousIndex, event.currentIndex);
      this.updateListPosition(newIssues);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        newIssues,
        event.previousIndex,
        event.currentIndex
      );
      this.updateListPosition(newIssues);
      newIssue.status = event.container.id as IssueStatus;
      this._projectService.updateIssue(newIssue);
    }
  }

  filterIssues(issues: JIssue[], filter: FilterState): JIssue[] {
    const { onlyMyIssue, ignoreResolved, searchTerm, userIds } = filter;
    return issues.filter((issue) => {
      const isMatchTerm = searchTerm ? IssueUtil.searchString(issue.title, searchTerm) : true;

      const isIncludeUsers = userIds.length ? userIds.includes(issue.reporterId) : true;

      const isMyIssue = onlyMyIssue
        ? this.currentUserId && this.currentUserId === issue.reporterId
        : true;

      const isIgnoreResolved = ignoreResolved ? issue.status !== IssueStatus.DONE : true;

      return isMatchTerm && isIncludeUsers && isMyIssue && isIgnoreResolved;
    });
  }

  isDateWithinThreeDaysFromNow(date: string) {
    const now = new Date();
    const inputDate = new Date(date);
    return dateFns.isAfter(inputDate, dateFns.subDays(now, 3));
  }

  private updateListPosition(newList: JIssue[]) {
    newList.forEach((issue, idx) => {
      const newIssueWithNewPosition = { ...issue, listPosition: idx + 1 };
      this._projectService.updateIssue(newIssueWithNewPosition);
    });
  }
}
