import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillBar } from '../../models/model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  @ViewChild("sectionHeader") sectionHeader!: ElementRef;

  frontendBars: SkillBar[] = [
    { name: 'Angular (v20)',       level: 70 },
    { name: 'HTML5 / CSS3 / SCSS', level: 80 },
    { name: 'TypeScript',          level: 70 },
    { name: 'JavaScript',          level: 70 },
    { name: 'RxJS',                level: 65 },
    { name: 'HttpClient / REST',   level: 65 },
  ];

  backendBars: SkillBar[] = [
    { name: 'Git / GitHub', level: 75 },
    { name: 'PostgreSQL',   level: 60 },
    { name: 'MS-SQL',       level: 60 },
    { name: 'Node.js',      level: 50 },
  ];

  groups = [
    {
      heading: 'Architecture',
      items: [
        'Micro-frontends',
        'MFE Communication',
        'Component Architecture',
        'Change Detection',
        'Git Workflow',
        'Agile / Scrum',
      ],
    },
    {
      heading: 'Platforms & Tools',
      items: [
        'VS Code',
        'SSMS',
        'Jira',
        'Confluence',
        'SonarQube',
        'GitHub Copilot',
        'Cursor',
      ],
    },
    { heading: 'Design', 
      items: [
        'Canva', 
        'Figma (Basic)', 
        'Pencil',
        'PowerPoint',
      ] },
  ];

  private headerObs!: IntersectionObserver;

  ngAfterViewInit(): void {
    this.headerObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.headerObs.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    this.headerObs.observe(this.sectionHeader.nativeElement);
  }

  ngOnDestroy(): void {
    this.headerObs?.disconnect();
  }
}