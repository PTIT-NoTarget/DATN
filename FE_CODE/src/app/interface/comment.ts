import { JUser } from './user';

export class JComment {
  id: number;
  body!: string;
  createdAt: string;
  updatedAt: string;
  issueId: number;
  userId!: string;
  // mapped to display by userId
  user: JUser;

  constructor(issueId: number, user: JUser) {
    const now = new Date();
    this.id = now.getTime();
    this.issueId = issueId;
    this.user = user;
    this.createdAt = now.toISOString();
    this.updatedAt = now.toISOString();
  }
}
