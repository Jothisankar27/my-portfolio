import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillBar } from '../../models/model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements AfterViewInit {
  @ViewChild("sectionHeader") sectionHeader!: ElementRef;
  @ViewChild("barsSection") barsSection!: ElementRef;

  frontendBars: SkillBar[] = [
    { name: 'Angular (v20)',      level: 70, animated: 0 },
    { name: 'HTML5 / CSS3 / SCSS',level: 80, animated: 0 },
    { name: 'TypeScript',         level: 78, animated: 0 },
    { name: 'JavaScript',         level: 72, animated: 0 },
    { name: 'RxJS',               level: 70, animated: 0 },
    { name: 'HttpClient / REST',  level: 70, animated: 0 },
  ];

  backendBars: SkillBar[] = [
    { name: 'Git / GitHub', level: 75, animated: 0 },
    { name: 'PostgreSQL',   level: 60, animated: 0 },
    { name: 'MS-SQL',       level: 60, animated: 0 },
    { name: 'Node.js',      level: 50, animated: 0 },
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

  ngAfterViewInit(): void {
    const headerObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            headerObs.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    headerObs.observe(this.sectionHeader.nativeElement);

    const barObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            this.animateBars();
            barObs.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    barObs.observe(this.barsSection.nativeElement);
  }

  private animateBars(): void {
    const DURATION = 1200;
    const STAGGER = 80;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    // Animate both columns — interleave stagger so left+right feel simultaneous
    // but each individual bar still cascades top-to-bottom within its column
    const allBars = this.frontendBars
      .map((s, i) => ({ skill: s, delay: i * STAGGER }))
      .concat(
        this.backendBars.map((s, i) => ({ skill: s, delay: i * STAGGER })),
      );

    allBars.forEach(({ skill, delay }) => {
      setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          skill.animated = Math.round(easeOut(progress) * skill.level);
          if (progress < 1) requestAnimationFrame(tick);
          else skill.animated = skill.level;
        };
        requestAnimationFrame(tick);
      }, delay);
    });
  }
}