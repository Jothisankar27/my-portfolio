import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AnalyticsService } from '../../services/analytics.service';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

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

  readonly status = signal<FormStatus>('idle');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  // ── Computed derived state (no manual getters needed)
  readonly isSending = computed(() => this.status() === 'sending');
  readonly isSuccess = computed(() => this.status() === 'success');
  readonly isError   = computed(() => this.status() === 'error');

  // ── Form submit handler
  onSubmit(): void {
    if (this.form.invalid || this.isSending()) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');

    const { name, email, message } = this.form.getRawValue();

    // ── Use FormData instead of JSON
    const formData = new FormData();
    formData.append('access_key', environment.web3formsKey);
    formData.append('subject', 'New message from portfolio contact form');
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
            this.form.reset();
          }
        },
        error: () => this.status.set('error'),
      });
  }

  reset(): void {
    this.status.set('idle');
  }
}