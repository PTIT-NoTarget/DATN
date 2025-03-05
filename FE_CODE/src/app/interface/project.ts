import { JIssue } from './issue';
import { JUser } from './user';

export interface JProject {
  id: number;
  name: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: number | null;
  manager_id: number | null;
  image_url: string | null;
  createdAt: string;
  updatedAt: string;
  issues: JIssue[];
  users: JUser[];
  tasks: JTask[];
}

// eslint-disable-next-line no-shadow
export enum ProjectCategory {
  SOFTWARE = 'Software',
  MARKETING = 'Marketing',
  BUSINESS = 'Business'
}

export interface JTask {
  id: number;
  project_id: number;
  name: string;
  description: string;
  label: string | null;
  status: string | null;
  priority: number | null;
  start_date: string | null;
  end_date: string | null;
  assigned_by: number | null;
  created_by: number;
  story_point: number | null;
  createdAt: string;
  updatedAt: string;
}
