import {
  Component,
  signal,
  ChangeDetectorRef,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Project } from "../../models/model";

@Component({
  selector: "app-work",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./work.component.html",
  styleUrl: "./work.component.scss",
})
export class WorkComponent {

  private cdr = inject(ChangeDetectorRef);

  activeIndex = signal(0);
  outgoingIndex: number | null = null;
  enterDir: "up" | "down" = "down";
  private animating = false;

  projects: Project[] = [
    {
      tag: "Infosys · Enterprise Scale Application",
      stack: "Angular [Micro-frontends] · Java [Spring Boot] · MS-SQL",
      title: "Order Management System",
      titleLine2: "2024 - Present",
      desc: "Led delivery across 3 major Angular version migrations (v13 → v18 → v20) on a production-scale enterprise application. Architected cross-micro-frontend communication services, integrated RESTful APIs, and earned 2× Rise Insta Awards for shipping critical features under tight deadlines.",
      bullets: [
        "Migrated a production codebase across 3 Angular major versions — zero downtime, full feature parity maintained throughout",
        "Built cross-MFE communication services that decoupled 4+ independently deployed micro-frontends, reducing inter-team dependency delays",
        "Resolved critical production bugs within same-day turnaround on 2 separate occasions — each recognised with a Rise Insta Award",
        "Mentored 2 onboarding engineers, cutting their ramp-up time by ~30% through structured code walkthroughs",
        "Delivered stakeholder-requested UI workflow changes end-to-end — from requirement to production — within sprint cycles",
      ],
      award: [
        { text: "Rise Insta Award · Infosys · For exceptional delivery of Requirements under minimal timeframe", year: 2025 },
        { text: "Rise Insta Award · Infosys · For Delivering Critical Modules in Production under Tight turnaround time", year: 2026 },
      ],
    },
    {
      tag: "Infosys · Virtual Events Hosting Platform",
      stack: "Angular · NodeJS · PostgreSQL",
      title: "Meridian Events",
      titleLine2: "2022 - 2024",
      desc: "Built features for a virtual events hosting platform serving large-scale online audiences. Collaborated with peer developers, optimised database queries, and delivered a real-time attendee chat proof-of-concept using PubNub.",
      bullets: [
        "Developed Angular + Node.js features across the full events lifecycle — registration, session management, and attendee engagement modules",
        "PostgreSQL query optimisation that identified and cleansed 10,000+ redundant records, improving query response time noticeably",
        "Built a real-time one-to-one attendee chat POC with PubNub APIs — demonstrated to stakeholders as a potential live feature",
      ],
    },
  ];

  selectProject(index: number): void {
    if (this.animating || index === this.activeIndex()) return;

    this.animating = true;
    this.outgoingIndex = this.activeIndex();
    this.enterDir = index > this.activeIndex() ? "down" : "up";

    // Step 1 — flush enterDir + outgoingIndex to the DOM first
    this.cdr.detectChanges();

    // Step 2 — wait one rAF so the browser has painted the new data-enter
    requestAnimationFrame(() => {
      this.activeIndex.set(index);
      this.cdr.detectChanges(); // paint the new active card immediately

      setTimeout(() => {
        this.outgoingIndex = null;
        this.animating = false;
        this.cdr.detectChanges();
      }, 260); // slightly longer than the 0.24s exit
    });
  }

  cardState(i: number): "active" | "exiting" | "hidden" {
    if (i === this.activeIndex()) return "active";
    if (i === this.outgoingIndex) return "exiting";
    return "hidden";
  }
}