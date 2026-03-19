import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements AfterViewInit {
  @ViewChild('sectionHeader') sectionHeader!: ElementRef;

  ngAfterViewInit(): void {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    obs.observe(this.sectionHeader.nativeElement);
  }
  groups = [
    { heading: 'Frontend', items: ['HTML5','CSS3 / SCSS','JavaScript','TypeScript','Angular (v20)','Bootstrap','Angular Material','RxJS','HttpClient'] },
    { heading: 'Backend & DB', items: ['Node.js','PostgreSQL','MS-SQL'] },
    { heading: 'Architecture', items: ['Micro-frontends','RESTful APIs','Agile / Scrum'] },
    { heading: 'Platforms & Tools', items: ['VS Code','Git / GitHub','SSMS','Jira','Confluence','SonarQube','GitHub Copilot','Cursor'] },
    { heading: 'Design', items: ['Canva','Figma (Basic)','Pencil'] }
  ];
}
