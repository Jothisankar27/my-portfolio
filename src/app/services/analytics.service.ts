import { Injectable } from '@angular/core';

declare const gtag: (...args: unknown[]) => void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  private dwellTimers = new Map<string, number>();

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

  // Section dwell tracking
  trackSectionEnter(sectionId: string): void {
    // start timer — performance.now() is ms since page load, no Date overhead
    this.dwellTimers.set(sectionId, performance.now());

    this.trackEvent('section_enter', {
      event_category: 'scroll_depth',
      section: sectionId
    });
  }

  trackSectionExit(sectionId: string): void {
    const startTime = this.dwellTimers.get(sectionId);
    if (startTime === undefined) return;

    const seconds = Math.round((performance.now() - startTime) / 1000);
    this.dwellTimers.delete(sectionId);

    // ignore sub-1s blips (fast scroll-throughs, not real reads)
    if (seconds < 1) return;

    this.trackEvent('section_dwell', {
      event_category: 'scroll_depth',
      section: sectionId,
      seconds
    });
  }
}