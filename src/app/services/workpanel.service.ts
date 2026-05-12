import { Injectable, signal } from '@angular/core';

export type ProjectChip = 'oms' | 'meridian' | null;

@Injectable({ providedIn: 'root' })
export class WorkPanelService {
  isOpen = signal(false);
  activeChip = signal<ProjectChip>('oms');

  open(): void {
    this.activeChip.set('oms');
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }

  selectChip(chip: ProjectChip): void {
    this.activeChip.set(chip);
  }
}