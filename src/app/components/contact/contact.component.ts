import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from '../../services/analytics.service';
import { CustomValidators } from '../../validators/custom-validator';
import { FormStatus } from 'src/app/models/model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {

  private readonly http = inject(HttpClient);
  private readonly analytics = inject(AnalyticsService);
  private readonly fb = inject(FormBuilder);

  readonly contactForm = this.fb.nonNullable.group({
    name: [
      "",
      [
        Validators.required,
        Validators.minLength(2),
        CustomValidators.notBlank(),
      ],
    ],
    email: ["", [Validators.required, Validators.email]],
    message: [
      "",
      [
        Validators.required,
        Validators.minLength(10),
        CustomValidators.notBlank(),
      ],
    ],
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

  // ── Form submit handler
  onSubmit(): void {
    if (this.contactForm.invalid || this.isSending()) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.status.set('sending');

    const { name, email, message } = this.contactForm.getRawValue();

    // ── Use FormData instead of JSON
    const formData = new FormData();
    formData.append('access_key', environment.web3formsKey);
    formData.append('from_name', name);
    formData.append('replyto', email);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    this.http
      .post<{ success: boolean }>(environment.web3Fromslink, formData)
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
  }
}