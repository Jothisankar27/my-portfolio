import { Component, ElementRef, PLATFORM_ID, computed, effect, inject, signal, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from '../../services/analytics.service';
import { CustomValidators } from '../../validators/custom-validator';
import { FormStatus, HCaptchaApi } from 'src/app/models/model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {

  private static readonly MIN_FILL_MS = 2000;
  private firstFocusAt = 0;


  private static readonly HCAPTCHA_SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
  private static readonly HCAPTCHA_SRC = 'https://js.hcaptcha.com/1/api.js?render=explicit';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly captchaEnabled =
    isPlatformBrowser(this.platformId) && !['localhost', '127.0.0.1'].includes(location.hostname);

  private readonly captchaHost = viewChild<ElementRef<HTMLElement>>('captcha');
  private captchaWidgetId: string | null = null;
  readonly captchaToken = signal('');
  readonly captchaFailed = signal(false);
  readonly captchaMissing = signal(false);

  constructor() {
    effect(() => {
      const host = this.captchaHost();
      if (host && this.captchaEnabled) void this.mountCaptcha(host.nativeElement);
    });
  }

  private readonly http = inject(HttpClient);
  private readonly analytics = inject(AnalyticsService);
  private readonly fb = inject(FormBuilder);

  readonly contactForm = this.fb.nonNullable.group({
    name: [
      "",
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        CustomValidators.notBlank(),
      ],
    ],
    email: ["", [Validators.required, Validators.email]],
    message: [
      "",
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
        CustomValidators.notBlank(),
      ],
    ],
    hp_trap: [""],
  });

  get name() {
    return this.contactForm.controls.name;
  }
  get email() {
    return this.contactForm.controls.email;
  }
  get message() {
    return this.contactForm.controls.message;
  }

  readonly status = signal<FormStatus>("idle");

  // ── Computed derived state (no manual getters needed)
  readonly isSending = computed(() => this.status() === 'sending');
  readonly isSuccess = computed(() => this.status() === 'success');
  readonly isError = computed(() => this.status() === 'error');

  onFormFocusIn(): void {
    if (!this.firstFocusAt) this.firstFocusAt = performance.now();
  }

  // ── Form submit handler
  onSubmit(): void {
    if (this.contactForm.invalid || this.isSending()) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const { name, email, message, hp_trap } = this.contactForm.getRawValue();

    // Honeypot filled: only a script can do that. Report success, send nothing.
    if (hp_trap) {
      this.status.set('success');
      this.contactForm.reset();
      return;
    }

    // Never focused a field, or submitted implausibly fast. A real person could
    // trip this (autofill + paste), so show the error banner instead of faking success.
    if (!this.firstFocusAt || performance.now() - this.firstFocusAt < ContactComponent.MIN_FILL_MS) {
      this.status.set('error');
      return;
    }

    const token = this.captchaToken();
    if (this.captchaEnabled && !token) {
      this.captchaMissing.set(true);
      return;
    }
    this.captchaMissing.set(false);

    this.status.set('sending');

    // ── Use FormData instead of JSON
    const formData = new FormData();
    formData.append('access_key', environment.web3formsKey);
    formData.append('subject', 'New message from your portfolio');
    formData.append('from_name', name);
    formData.append('replyto', email);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    if (token) 
      formData.append('h-captcha-response', token);

    this.http
      .post<{ success: boolean }>(environment.web3Formslink, formData)
      .subscribe({
        next: (res) => {
          this.status.set(res.success ? 'success' : 'error');
          if (res.success) {
            this.analytics.trackContactSubmit();
            this.contactForm.reset();
          }
          this.resetCaptcha();
        },
        error: () => {
          this.status.set('error');
          this.resetCaptcha();
        },
      });
  }

  // ── hCaptcha (loaded on demand, browser only)
  private async mountCaptcha(host: HTMLElement): Promise<void> {
    try {
      await this.loadHcaptchaScript();
    } catch {
      this.captchaFailed.set(true);
      return;
    }
    const api = this.hcaptchaApi();
    if (!api) {
      this.captchaFailed.set(true);
      return;
    }
    this.captchaFailed.set(false);
    this.captchaToken.set('');
    host.replaceChildren();
    const light = document.documentElement.getAttribute('data-theme') === 'newspaper';
    this.captchaWidgetId = api.render(host, {
      sitekey: ContactComponent.HCAPTCHA_SITE_KEY,
      theme: light ? 'light' : 'dark',
      callback: (token: string) => {
        this.captchaToken.set(token);
        this.captchaMissing.set(false);
      },
      'expired-callback': () => this.captchaToken.set(''),
      'error-callback': () => this.captchaToken.set(''),
    });
  }

  private hcaptchaApi(): HCaptchaApi | undefined {
    return (window as unknown as { hcaptcha?: HCaptchaApi }).hcaptcha;
  }

  private loadHcaptchaScript(): Promise<void> {
    if (this.hcaptchaApi()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-hcaptcha]');
      const script = existing ?? document.createElement('script');
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => reject(new Error('hCaptcha failed to load')), { once: true });
      if (!existing) {
        script.src = ContactComponent.HCAPTCHA_SRC;
        script.async = true;
        script.defer = true;
        script.dataset['hcaptcha'] = 'true';
        document.head.appendChild(script);
      }
    });
  }

  /** hCaptcha tokens are single-use, so every attempt needs a fresh one. */
  private resetCaptcha(): void {
    this.captchaToken.set('');
    if (this.captchaWidgetId !== null) this.hcaptchaApi()?.reset(this.captchaWidgetId);
  }

  reset(): void {
    this.status.set('idle');
    this.firstFocusAt = 0;
  }
}