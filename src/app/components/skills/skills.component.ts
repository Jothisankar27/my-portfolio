import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evidence, SkillCategory,  } from 'src/app/models/model';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { SKILLS } from '../../models/skills.data';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, LightboxComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {

  activeEvidence = signal<Evidence | null>(null);

  openEvidence(evidence: Evidence): void {
    this.activeEvidence.set(evidence);
  }

  closeEvidence(): void {
    this.activeEvidence.set(null);
  }


  readonly categories: readonly SkillCategory[] = SKILLS;

  onIconError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}