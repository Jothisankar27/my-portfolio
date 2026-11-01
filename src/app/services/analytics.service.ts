/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

declare const gtag: (...args: unknown[]) => void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  private readonly http = inject(HttpClient);
  private dwellTimers = new Map<string, number>();
  private readonly platformId = inject(PLATFORM_ID);
  private static readonly RESUME_PING_KEY = 'resume_ping_at';
  private static readonly RESUME_PING_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  private resumePingedThisPage = false;

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

  private shouldNotifyResume(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    if (navigator.webdriver) return false;          // headless / automated browsers
    if (this.resumePingedThisPage) return false;    // works even if storage is blocked
    this.resumePingedThisPage = true;

    try {
      const last = Number(localStorage.getItem(AnalyticsService.RESUME_PING_KEY));
      if (last && Date.now() - last < AnalyticsService.RESUME_PING_COOLDOWN_MS) return false;
      localStorage.setItem(AnalyticsService.RESUME_PING_KEY, String(Date.now()));
    } catch {
      // storage unavailable (private mode etc.) — the in-memory flag above still applies
    }
    return true;
  }

  /** Both values are attacker-controlled and end up in your inbox, so keep them boring. */
  private static cleanRef(raw: string | null): string {
    return (raw ?? '').replace(/[^\w.-]/g, '').slice(0, 40) || 'none';
  }

  private static referrerOrigin(): string {
    if (!document.referrer) return 'direct / unknown';
    try {
      return new URL(document.referrer).origin; // origin only: no paths, queries or tokens
    } catch {
      return 'unknown';
    }
  }

  private notifyResumeAccess(): void {
    if (!this.shouldNotifyResume()) return;

    const referrer = AnalyticsService.referrerOrigin();
    const ref = AnalyticsService.cleanRef(new URLSearchParams(window.location.search).get('ref'));

    const formData = new FormData();
    // Separate access key from the contact form: the contact key enforces a captcha
    // (which a silent ping cannot solve), and this one can be disabled or rotated on its own if someone abuses it.
    formData.append('access_key', environment.web3formsPingKey);
    formData.append('subject', 'Resume viewed/downloaded on portfolio');
    formData.append(
      'message',
      `Someone opened your resume at ${new Date().toLocaleString()}.\n` +
      `Referrer: ${referrer}\n` +
      `Tagged link (?ref=): ${ref}`
    );

    this.http.post(environment.web3Formslink, formData).subscribe({ error: () => {} });
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