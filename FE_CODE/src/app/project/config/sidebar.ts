import { SideBarLink } from '@tungle/interface/ui-model/nav-link';

export const SideBarLinks = [
  // new SideBarLink('DashBoard', 'board', 'board'),
  new SideBarLink('Dashboard', 'cog', 'dashboard'),
  new SideBarLink('Danh sách dự án', 'cog', 'projects'),
  new SideBarLink('Quản lý người dùng', 'cog', 'user-management'),
  new SideBarLink('Quản lý phòng ban', 'cog', 'department-management'),
  new SideBarLink('Quản lý thông báo', 'cog', 'noti-management'),

  new SideBarLink('Trang cá nhân', 'cog', 'profile'),


  // new SideBarLink('Project Settings', 'cog', 'settings'),
  // new SideBarLink('Releases', 'ship'),
  // new SideBarLink('Issues and filters', 'filters'),
  // new SideBarLink('Pages', 'page'),
  // new SideBarLink('Reports', 'report'),
  // new SideBarLink('Components', 'component')
];
