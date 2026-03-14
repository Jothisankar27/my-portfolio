import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  groups = [
    { heading: 'Frontend', items: ['Angular (v13–v20)','JavaScript','HTML5','CSS3 / SCSS','Bootstrap','Angular Material','RxJS','HttpClient'] },
    { heading: 'Architecture', items: ['Micro-frontends','RESTful APIs','Component Design','Agile / Scrum'] },
    { heading: 'Backend & DB', items: ['Node.js','PostgreSQL','MS-SQL'] },
    { heading: 'Tooling', items: ['GitHub Copilot','Cursor','VS Code','Git / GitHub','Jira','SonarQube','JFrog','Figma (Basic)'] }
  ];
}
