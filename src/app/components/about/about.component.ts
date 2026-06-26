import { Component, signal, inject, ElementRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stat } from '../../models/model';
@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.scss",
})
export class AboutComponent {

  private host = inject(ElementRef);

  readonly stats: Stat[] = [
    { 
      num: 4, 
      label: 'Years experience',
      display: signal(0) 
    },
    { 
      num: 3, 
      label: 'Angular version migrations', 
      display: signal(0)
    },
    { 
      num: 2, 
      label: 'Enterprise platforms',       
      display: signal(0)
    },
  ];

  constructor() {
    afterNextRender(() => {
      const statsEl = this.host.nativeElement.querySelector('.about-stats') as HTMLElement;
      if (!statsEl) return;

      let counted = false;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !counted) {
            counted = true;
            observer.disconnect();
            this.animateCounters();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(statsEl);
    });
  }

  private animateCounters(): void {
    const DURATION = 1400;
    const STAGGER  = 120;
    const easeOut  = (t: number) => 1 - Math.pow(1 - t, 3);

    this.stats.forEach((stat, i) => {
      setTimeout(() => {
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          stat.display.set(Math.round(easeOut(progress) * stat.num));
          if (progress < 1) requestAnimationFrame(tick);
          else stat.display.set(stat.num);
        };

        requestAnimationFrame(tick);
      }, i * STAGGER);
    });
  }
}