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
      role: "Angular Frontend Developer",
      place: "Infosys — Order Management System",
      desc: "Angular v20 migration, micro-frontend architecture, cross-MFE communication, stakeholder delivery. Rise Insta Award recipient.",
      type: "work",
      current: true,
    },
    {
      year: "2022",
      role: "Angular Frontend Developer",
      place: "Infosys — Meridian Events · Bengaluru, India",
      desc: "Joined Infosys; built virtual event platform features on Angular + Node.js. PubNub real-time chat POC. PostgreSQL query optimisation.",
      type: "work",
    },
    {
      year: "2020",
      role: "Quality Inspector",
      place: "Automotive Industry — Hosur, Tamil Nadu",
      desc: "Root-cause analysis, process documentation, tolerance inspection. Built the instincts for precision that now go into every component.",
      type: "milestone",
    },
  ];
}