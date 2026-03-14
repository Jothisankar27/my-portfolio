import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.scss",
})
export class AboutComponent implements AfterViewInit {
  @ViewChild("statsSection") statsSection!: ElementRef;

  stats = [
    { num: 4, label: "Years experience", display: 0 },
    { num: 3, label: "Major Angular migrations", display: 0 },
    { num: 2, label: "Enterprise platforms", display: 0 },
  ];

  ngAfterViewInit(): void {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            this.animateCounters();
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(this.statsSection.nativeElement);
  }

  private animateCounters(): void {
    this.stats.forEach((stat) => {
      const duration = 1200;
      const steps = 60;
      const increment = stat.num / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.num) {
          stat.display = stat.num;
          clearInterval(timer);
        } else {
          stat.display = Math.floor(current);
        }
      }, duration / steps);
    });
  }
}
