import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from '../../services/analytics.service';
import { CustomValidators } from '../../validators/custom-validator';
import { FormStatus } from 'src/app/models/model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {

  /** A human can't focus a field, type a message and submit faster than this. */
  private static readonly MIN_FILL_MS = 2000;
  private firstFocusAt = 0;

  private readonly http = inject(HttpClient);
  private readonly analytics = inject(AnalyticsService);
  private readonly fb = inject(FormBuilder);

  readonly contactForm = this.fb.nonNullable.group({
    name: [
      "",
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
        CustomValidators.notBlank(),
      ],
    ],
    email: ["", [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: [
      "",
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000),
        CustomValidators.notBlank(),
      ],
    ],
    // Honeypot: hidden from people, irresistible to form-filling bots.
    // Deliberately not named "website"/"url"/"company": browsers autofill those,
    // which would silently drop a real person's message.
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
  readonly isError   = computed(() => this.status() === 'error');

  /** First interaction with any field starts the "too fast to be human" clock. */
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

    this.http
      .post<{ success: boolean }>(environment.web3Formslink, formData)
      .subscribe({
        next: (res) => {
          this.status.set(res.success ? 'success' : 'error');
          if (res.success) {
            this.analytics.trackContactSubmit();
            this.contactForm.reset();
          }
        },
        error: () => this.status.set('error'),
      });
  }

  reset(): void {
    this.status.set('idle');
    this.firstFocusAt = 0;
  }
}