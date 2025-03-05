import { NzModalRef } from 'ng-zorro-antd/modal';

export class DeleteIssueModel {
  constructor(public issueId: number, public deleteModalRef: NzModalRef) {}
}
