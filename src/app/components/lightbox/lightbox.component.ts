import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Evidence } from '../../models/model';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
})
export class LightboxComponent {
  private platformId = inject(PLATFORM_ID);

  private _evidence: Evidence | null = null;
  imageLoaded = false;

  @Input()
  set evidence(value: Evidence | null) {
    this._evidence = value;
    this.imageLoaded = false; // reset skeleton whenever a new evidence is opened
  }
  get evidence(): Evidence | null {
    return this._evidence;
  }

  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (isPlatformBrowser(this.platformId) && this.evidence) {
      this.close();
    }
  }

  onImageLoad(): void {
    this.imageLoaded = true;
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