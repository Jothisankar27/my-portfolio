import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Evidence } from '../../models/model';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEsc()' },
})
export class LightboxComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly evidence = input<Evidence | null>(null);
  readonly closed = output<void>();

  // Resets to false whenever a new evidence item is opened, so the skeleton shows again.
  readonly imageLoaded = linkedSignal<Evidence | null, boolean>({
    source: this.evidence,
    computation: () => false,
  });

  onEsc(): void {
    if (this.isBrowser && this.evidence()) {
      this.close();
    }
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}