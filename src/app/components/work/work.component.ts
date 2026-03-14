import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Project {
  tag: string;
  stack: string;
  title: string;
  //titleLine2: string;
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
      tag: 'Infosys · 2022 – Present',
      stack: 'Angular [Micro-frontends] · Java [Spring Boot] · MS-SQL ',
      title: 'Order Management System',
     // titleLine2: 'System',
      desc: 'Worked on migration from Angular v13 → v18 → v20 on a production-scale application. Architected cross-micro-frontend communication services, integrated RESTful APIs, and redesigned UI workflows — shipping faster with AI-assisted tooling.',
      bullets: [
        'Micro-frontend architecture with decoupled UI components',
        'End-to-end framework migration maintaining full stability',
        'Angular HttpClient services for real-time data handling',
        'Earned Rise Insta Award for exceptional delivery'
      ],
      award: '🏅 Rise Insta Award · Infosys'
    },
    {
      tag: 'Infosys · Virtual Events Streaming Platform',
      stack: 'Angular · NodeJS · PostgreSQL',
      title: 'Meridian Events',
      //titleLine2: 'Platform',
      desc: 'Engineered features for a virtual event hosting platform at scale. Optimised database queries with Node.js, and prototyped a live attendee chat using PubNub APIs to drive real-time engagement.',
      bullets: [
        'High-stability event features on Angular + PostgreSQL',
        'Query analysis and Node.js optimisation for data flow',
        'Real-time chat POC using PubNub & JavaScript'
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
