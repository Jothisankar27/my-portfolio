import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evidence, SkillCategory,  } from 'src/app/models/model';
import { LightboxComponent } from '../lightbox/lightbox.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, LightboxComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {

  readonly certEvidence: Evidence = {
    file: 'assets/documents/GH300-Certificate.pdf',
    type: 'pdf',
    label: 'GH-300 — GitHub Copilot Certification',
    previewImage: 'assets/documents/gh-300-preview.jpg',
  };

  activeEvidence = signal<Evidence | null>(null);

  openEvidence(evidence: Evidence): void {
    this.activeEvidence.set(evidence);
  }

  closeEvidence(): void {
    this.activeEvidence.set(null);
  }


  readonly categories: SkillCategory[] = [
    {
      heading: 'Languages',
      items: [
        { name: 'HTML5', iconSrc: 'assets/svg-assets/html5.svg' },
        { name: 'CSS3', iconSrc: 'assets/svg-assets/css3.svg' },
        { name: 'Sass / SCSS', iconSrc: 'assets/svg-assets/sass.svg' },
        { name: 'JavaScript', iconSrc: 'assets/svg-assets/javascript.svg' },
        { name: 'TypeScript', iconSrc: 'assets/svg-assets/typescript.svg' },
        { name: 'SQL', iconSrc: 'assets/svg-assets/sql.svg' },
      ],
    },
    {
      heading: 'Frameworks & Libraries',
      items: [
        { name: 'Angular', iconSrc: 'assets/svg-assets/angular.svg' },
        { name: 'Node.js', iconSrc: 'assets/svg-assets/nodejs.svg' },
        { name: 'RxJS', iconSrc: 'assets/svg-assets/rxjs.svg' },
        { name: 'Bootstrap', iconSrc: 'assets/svg-assets/bootstrap.svg' },
        { name: 'PostgreSQL', iconSrc: 'assets/svg-assets/postgresql.svg' },
        { name: 'MS SQL Server', iconSrc: 'assets/svg-assets/mssql.svg' },
        { name: 'Infragistics', iconSrc: 'assets/infragistics.png' },
      ],
    },
    {
      heading: 'Tools & Version Control',
      items: [
        { name: 'Git', iconSrc: 'assets/svg-assets/git.svg' },
        { name: 'GitHub', iconSrc: 'assets/svg-assets/github1.svg' },
        { name: 'Tortoise Git', iconSrc: 'assets/svg-assets/tortoisegit.svg' },
        { name: 'VS Code', iconSrc: 'assets/svg-assets/vscode.svg' },
        { name: 'SonarQube', iconSrc: 'assets/svg-assets/sonarqube.svg' },
        { name: 'JFrog', iconSrc: 'assets/svg-assets/jfrog.svg' },
        { name: 'Jira', iconSrc: 'assets/svg-assets/jira.svg' },
        { name: 'Confluence', iconSrc: 'assets/svg-assets/confluence.svg' },
      ],
    },
    {
      heading: 'AI & Assisted Development',
      items: [
        { name: 'GitHub Actions', iconSrc: 'assets/svg-assets/githubactions.svg' },
        {
          name: 'GitHub Copilot',
          iconSrc: 'assets/svg-assets/githubcopilot.svg',
          evidence: this.certEvidence,
          badge: 'GH-300 Certified',
        },
        { name: 'Cursor', iconSrc: 'assets/svg-assets/cursor.svg' },
        { name: 'Claude Code', iconSrc: 'assets/svg-assets/claudecode.svg' },
      ],
    },
    {
      heading: 'Design',
      items: [
        { name: 'Figma', iconSrc: 'assets/svg-assets/figma.svg' },
        { name: 'Canva', iconSrc: 'assets/svg-assets/canva.svg' },
        { name: 'PowerPoint', iconSrc: 'assets/svg-assets/powerpoint.svg' },
        { name: 'Pencil', iconSrc: 'assets/pencil.ico' },
      ],
    },
  ];

  onIconError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}