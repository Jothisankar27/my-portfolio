import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  tag: string;
  stack: string;
  title: string;
  titleLine2: string;
  desc: string;
  bullets: string[];
  award?: string;
}

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss'
})
export class WorkComponent implements AfterViewInit {
  @ViewChildren('card') cards!: QueryList<ElementRef>;

  projects: Project[] = [
    {
      tag: 'Infosys · Enterprise Scale Application',
      stack: 'Angular [Micro-frontends] · Java [Spring Boot] · MS-SQL ',
      title: 'Order Management System',
      titleLine2: '2024 - Present',
      desc: 'Collaborated on migration from Angular v13 → v18 → v20 on a production-scale application. Worked on cross-micro-frontend communication services, integrated RESTful APIs, and redesigned UI workflows — delivering swiftly with AI-assisted workflows.',
      bullets: [
        'Angular HttpClient services for real-time data handling and Micro-frontend architecture with decoupled UI components',
        'Actively supported team productivity by assisting peers with complex tasks and providing informal mentorship to onboard new members',
        'Handled Production issues and delivered critical bug fixes with in minimal turnaround time',
        'Connected with Stakeholders and delivered features based on their requirements, suggestions',
        'End-to-end framework migration with maintaining full stability',
      ],
      award: 'Rise Insta Award · Infosys · For exceptional delivery of Requirements under minimal timeframe'
    },
    {
      tag: 'Infosys · Virtual Events Hosting Platform',
      stack: 'Angular · NodeJS · PostgreSQL',
      title: 'Meridian Events',
      titleLine2: '2022 - 2024',
      desc: 'Developed features for a virtual event hosting platform at scale. Worked and assisted peer developers and prototyped a live attendee chat using PubNub APIs to drive real-time engagement.',
      bullets: [
        'Virtual event Hosting Platform features on Angular + Node.JS stack',
        'Query analysis Using postgreSQL + Node.js for data optimisation which cleansed 10K+ redundant records',
        'Real-time one-to-one chat POC using PubNub APIs & NodeJS'
      ]
    }
  ];

  ngAfterViewInit(): void {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    this.cards.forEach(c => obs.observe(c.nativeElement));
  }
}
