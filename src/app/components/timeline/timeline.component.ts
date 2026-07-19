import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEvent } from '../../models/model';

@Component({
  selector: "app-timeline",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./timeline.component.html",
  styleUrl: "./timeline.component.scss",
})
export class TimelineComponent {
  events: TimelineEvent[] = [
    {
      year: "2026",
      role: "Frontend Developer",
      place: "Tata Consultancy Services · Bengaluru, Karnataka, India",
      desc: "Excited to join TCS as an Angular Developer, contributing to innovative projects and expanding my expertise in web development.",
      type: "work",
      current: true,
    },
    {
      year: "2022",
      role: "Frontend Developer",
      place: "Infosys Limited · Bengaluru, Karnataka, India",
      desc: "Angular v20 migration, micro-frontend architecture, cross-MFE communication, stakeholder delivery. Rise Insta Award recipient.",
      type: "work",
    },
    {
      year: "2020",
      role: "Quality Inspector",
      place: "Automotive Industry · Hosur, Tamil Nadu, India",
      desc: "Root-cause analysis, process documentation, tolerance inspection. Built the instincts for precision that now go into every component.",
      type: "milestone",
    },
  ];
}