/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

declare const gtag: (...args: unknown[]) => void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  private readonly http = inject(HttpClient);
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
    this.notifyResumeAccess();
  }

  private notifyResumeAccess(): void {
    const referrer = document.referrer || 'direct / unknown';
    const ref = new URLSearchParams(window.location.search).get('ref') || 'none';

    const formData = new FormData();
    formData.append('access_key', environment.web3formsKey);
    formData.append('subject', 'Resume viewed/downloaded on portfolio');
    formData.append(
      'message',
      `Someone opened your resume at ${new Date().toLocaleString()}.\n` +
      `Referrer: ${referrer}\n` +
      `Tagged link (?ref=): ${ref}`
    );

    this.http.post(environment.web3Fromslink, formData).subscribe({ error: () => {} });
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