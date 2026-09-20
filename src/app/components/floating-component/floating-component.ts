import { Component, inject } from '@angular/core';
import { AnalyticsService } from "../../services/analytics.service";

@Component({
  selector: 'app-floating-component',
  standalone: true,
  templateUrl: './floating-component.html',
  styleUrl: './floating-component.scss',
})
export class FloatingComponent {

  private analytics = inject(AnalyticsService);
 
  onResumeDownload(): void {
    this.analytics.trackResumeDownload();
  }

}
