import { Component, OnInit } from '@angular/core';
import { ProjectService } from './state/project/project.service';
import { AuthService } from './auth/auth.service';
import { LoginPayload } from '@tungle/project/auth/loginPayload';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  expanded: boolean;
  constructor(private _projectService: ProjectService, private _authService: AuthService) {
    this.expanded = true;
  }

  ngOnInit(): void {
    this._authService.getUser();
    // this._projectService.getProject();
    // this._projectService.getProjectDetail(9);
    this.handleResize();
  }

  handleResize() {
    const match = window.matchMedia('(min-width: 1024px)');
    match.addEventListener('change', (e) => {
      console.log(e);
      this.expanded = e.matches;
    });
  }

  manualToggle() {
    this.expanded = !this.expanded;
  }
}
