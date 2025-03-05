
import { JComment } from './comment';

/* eslint-disable no-shadow */
export enum IssueType {
  STORY = 'Document',
  TASK = 'Task',
  BUG = 'Bug'
}

export enum IssueStatus {
  BACKLOG = '0',
  NEW = '1',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  IN_PROGRESS = '2',
  // READY_TO_TEST = '3',
  TESTING = '4',
  DONE = '5',
  REJECT = '6'
}

export const IssueStatusDisplay = {
  [IssueStatus.BACKLOG]: 'Backlog',
  [IssueStatus.NEW]: 'Chưa xử lý',
  [IssueStatus.IN_PROGRESS]: 'Đang xử lý',
  // [IssueStatus.READY_TO_TEST]: 'Ready to test',
  [IssueStatus.TESTING]: 'Chờ duyệt',
  [IssueStatus.DONE]: 'Hoàn thành',
  [IssueStatus.REJECT]: 'Hủy bỏ'
};

export enum IssuePriority {
  LOWEST = 'Lowest',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  HIGHEST = 'Highest'
}

export const IssuePriorityColors = {
  [IssuePriority.HIGHEST]: '#CD1317',
  [IssuePriority.HIGH]: '#E9494A',
  [IssuePriority.MEDIUM]: '#E97F33',
  [IssuePriority.LOW]: '#2D8738',
  [IssuePriority.LOWEST]: '#57A55A'
};
export interface JIssue {
  id: number;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  listPosition: number;
  description: string;
  estimate: number;
  timeSpent: number;
  timeRemaining: number;
  createdAt: string;
  updatedAt: string;
  reporterId: number;
  userIds: number[];
  comments: JComment[];
  projectId: number;
  //
  startDate: string | null;
  endDate: string | null;
  createdBy: number;
  storyPoint: number | null;
}
/* eslint-enable no-shadow */
