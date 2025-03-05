import { Component } from '@angular/core';
import { GoogleAnalyticsService } from '@tungle/core/services/google-analytics.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  breadcrumbs: string[] = ['Daily', 'DashBoard'];

  constructor(private _googleAnalytics: GoogleAnalyticsService) {}

  sendTwitterEventButton() {
    this._googleAnalytics.sendEvent('Share Twitter', 'button');
  }
}
