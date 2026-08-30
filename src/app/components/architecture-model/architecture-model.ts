import { Component, inject, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { ArchitectureModelService } from '../../services/architecture-model.service';
import { ArchView } from '../../models/model';


@Component({
  selector: 'app-architecture-model',
  standalone: true,
  templateUrl: './architecture-model.html',
  styleUrl: './architecture-model.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchitectureModel {
  private modal = inject(ArchitectureModelService);

  isOpen = this.modal.isOpen;

  // Local only — nothing outside this component needs to know which
  // sub-view is showing.
  view = signal<ArchView>('narrative');

  toggleView(): void {
    this.view.set(this.view() === 'narrative' ? 'features' : 'narrative');
  }

  close(): void {
    this.modal.close();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}