import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormModel } from '../../models/model';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {

  private readonly http = inject(HttpClient);

  readonly status = signal<FormStatus>('idle');
  readonly model = signal<FormModel>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // ── Computed derived state (no manual getters needed) 
  readonly isSending = computed(() => this.status() === 'sending');
  readonly isSuccess = computed(() => this.status() === 'success');
  readonly isError   = computed(() => this.status() === 'error');

  // ── Form submit handler
  onSubmit(form: NgForm): void {
    if (form.invalid || this.isSending()) return;

    this.status.set('sending');

    const { name, email, subject, message } = this.model();

    // ── Use FormData instead of JSON
    const formData = new FormData();
    formData.append('access_key',environment.web3formsKey);
    formData.append('subject','Portfolio message: ' + subject);
    formData.append('from_name',name);
    formData.append('replyto',email);
    formData.append('name',name);
    formData.append('email',email);
    formData.append('message',message);
    // formData.append('botcheck','');

    // No Content-Type header — let the browser set it automatically with
    // the correct multipart boundary for FormData
    this.http
      .post<{ success: boolean }>(environment.web3Fromslink, formData)
      .subscribe({
        next: (res) => {
          this.status.set(res.success ? 'success' : 'error');
          if (res.success) {
            form.resetForm();
            this.model.set({ name: '', email: '', subject: '', message: '' });
          }
        },
        error: () => this.status.set('error'),
      });
  }

  // ── Field updater (keeps model signal immutable pattern) 
  updateField(field: keyof FormModel, value: string): void {
    this.model.update(m => ({ ...m, [field]: value }));
  }

  reset(): void {
    this.status.set('idle');
  }
}