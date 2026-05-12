import {
  Component,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkPanelService, ProjectChip } from '../../services/workpanel.service';

interface ProjectImage {
  src: string;
  label: string;
  caption?: string;
}

interface ChipData {
  id: ProjectChip;
  label: string;
  sub: string;
  blurb: string;
  tags: string[];
  images: ProjectImage[];
}

@Component({
  selector: 'app-workpanel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workpanel.component.html',
  styleUrl: './workpanel.component.scss',
})
export class WorkPanelComponent {
  panelService = inject(WorkPanelService);

  chips: ChipData[] = [
    {
      id: 'oms',
      label: 'Order Management System',
      sub: '2024 – Present',
      blurb:
        'Enterprise-scale micro-frontend application built on Angular v20. Migrated from v13 → v18 → v20, with real-time data services and cross-MFE communication.',
      tags: ['Angular v20', 'Micro-frontends', 'Spring Boot', 'MS-SQL'],
      images: [
        // Replace these src values with your actual screenshot paths in /assets/
        // e.g. 'assets/oms/dashboard.png'
        // Currently showing placeholder — add real screenshots to assets/oms/
      ],
    },
    {
      id: 'meridian',
      label: 'Meridian Events',
      sub: '2022 – 2024',
      blurb:
        'Virtual event hosting platform at Infosys. Developed features, optimised PostgreSQL queries that cleansed 10K+ records, and built a real-time chat POC via PubNub.',
      tags: ['Angular', 'NodeJS', 'PostgreSQL', 'PubNub'],
      images: [
        // Replace these src values with your actual screenshot paths in /assets/
        // e.g. 'assets/meridian/events-list.png'
        // Currently showing placeholder — add real screenshots to assets/meridian/
      ],
    },
  ];

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('panel-backdrop')) {
      this.panelService.close();
    }
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.panelService.isOpen()) {
      this.panelService.close();
    }
  }
}