import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tier } from '../../models/model';
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {

  tiers: Tier[] = [
    {
      key:   'expert',
      label: 'Expert',
      desc:  'Production-grade, daily use',
      skills: [
        'Angular (v13 → v20)',
        'TypeScript',
        'HTML5 / CSS3 / SCSS',
        'RxJS',
        'Component Architecture',
        'Micro-frontends (MFE)',
      ],
    },
    {
      key:   'proficient',
      label: 'Proficient',
      desc:  'Shipped in real projects',
      skills: [
        'JavaScript (ES6+)',
        'HttpClient / REST APIs',
        'Git / GitHub',
        'Cross-MFE Communication',
        'PostgreSQL',
        'MS-SQL',
      ],
    },
    {
      key:   'familiar',
      label: 'Familiar',
      desc:  'POC / supporting work',
      skills: [
        'Node.js',
        'SonarQube',
        'Figma (Basic)',
      ],
    },
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
        'Jira / Confluence',
        'SSMS',
        'PGAdmin',
        'SonarQube',
        'Claude Code',
        'GitHub Copilot',
        'Cursor',
      ],
    },
    {
      heading: 'Design',
      items: [
        'Canva',
        'Figma (Basic)',
        'Pencil',
        'PowerPoint',
      ],
    },
  ];
}