import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AnalyticsService } from "../../services/analytics.service";
import { LINKS } from '../../data/profile.data';

@Component({
  selector: 'app-floating-component',
  standalone: true,
  templateUrl: './floating-component.html',
  styleUrl: './floating-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingComponent {

  private analytics = inject(AnalyticsService);

  readonly resumeHref = LINKS.resume;
 
  onResumeDownload(): void {
    this.analytics.trackResumeDownload();
  }

}