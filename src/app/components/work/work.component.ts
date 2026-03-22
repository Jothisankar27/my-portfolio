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
      desc: "Collaborated on migration from Angular v13 → v18 → v20 on a production-scale application. Worked on cross-micro-frontend communication services, integrated RESTful APIs, and redesigned UI workflows — delivering swiftly with AI-assisted workflows.",
      bullets: [
        "Angular HttpClient services for real-time data handling and Micro-frontend architecture with decoupled UI components",
        "Actively supported team productivity by assisting peers with complex tasks and providing informal mentorship to onboard new members",
        "Handled Production issues and delivered critical bug fixes with in minimal turnaround time",
        "Connected with Stakeholders and delivered features based on their requirements, suggestions",
        "End-to-end framework migration with maintaining full stability",
      ],
      award:"Rise Insta Award · Infosys · For exceptional delivery of Requirements under minimal timeframe",
    },
    {
      tag: "Infosys · Virtual Events Hosting Platform",
      stack: "Angular · NodeJS · PostgreSQL",
      title: "Meridian Events",
      titleLine2: "2022 - 2024",
      desc: "Developed features for a virtual event hosting platform at scale. Worked and assisted peer developers and prototyped a live attendee chat using PubNub APIs to drive real-time engagement.",
      bullets: [
        "Virtual event Hosting Platform features on Angular + Node.JS stack",
        "Query analysis Using postgreSQL + Node.js for data optimisation which cleansed 10K+ redundant records",
        "Real-time one-to-one chat POC using PubNub APIs & NodeJS",
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
