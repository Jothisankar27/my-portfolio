import { Injectable } from '@angular/core';

declare const gtag: (...args: unknown[]) => void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (typeof gtag === 'undefined') return;
    gtag('event', eventName, params ?? {});
  }

  trackResumeDownload(): void {
    this.trackEvent('resume_download', {
      event_category: 'engagement',
      event_label: 'PDF Resume'
    });
  }

  trackContactSubmit(): void {
    this.trackEvent('contact_form_submit', {
      event_category: 'lead'
    });
  }

  trackWorkPanelOpen(projectName: string): void {
    this.trackEvent('work_panel_open', {
      event_category: 'engagement',
      event_label: projectName
    });
  }
}