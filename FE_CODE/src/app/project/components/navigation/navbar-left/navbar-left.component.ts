import { Component, OnInit } from '@angular/core';
import { AuthQuery } from '@tungle/project/auth/auth.query';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { SearchDrawerComponent } from '../../search/search-drawer/search-drawer.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddIssueModalComponent } from '../../add-issue-modal/add-issue-modal.component';
import { AuthService } from '@tungle/core/apis/auth.service';

@Component({
  selector: 'app-navbar-left',
  templateUrl: './navbar-left.component.html',
  styleUrls: ['./navbar-left.component.scss']
})
export class NavbarLeftComponent implements OnInit {
  items: NavItem[] = [];
  constructor(
    public authQuery: AuthQuery,
    private _drawerService: NzDrawerService,
    private _modalService: NzModalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.items = [
      new NavItem('search', 'Search issues', this.openSearchDrawler.bind(this)),
      // new NavItem('plus', 'Create issue', this.openCreateIssueModal.bind(this))
    ];
  }

  openCreateIssueModal() {
    this._modalService.create({
      nzContent: AddIssueModalComponent,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 700
    });
  }

  openSearchDrawler() {
    this._drawerService.create({
      nzContent: SearchDrawerComponent,
      nzTitle: '',
      nzPlacement: 'left',
      nzClosable: false,
      nzWidth: 500
    });
  }

  logOut() {
    this.authService.logout();
  }
}

class NavItem {
  constructor(public icon: string, public tooltip: string, public handler: Handler) {}
}

type Handler = () => void;
