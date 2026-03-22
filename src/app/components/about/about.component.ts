import { Component, AfterViewInit, ElementRef, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./about.component.html",
  styleUrl: "./about.component.scss",
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('statsSection') statsSection!: ElementRef;

  stats = [
    { num: 4, label: "Years experience",           display: 0 },
    { num: 3, label: "Angular version migrations", display: 0 },
    { num: 2, label: "Enterprise platforms",       display: 0 },
  ];

  private counted = false;
  private observer!: IntersectionObserver;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    const el = this.statsSection.nativeElement as HTMLElement;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.counted) {
          this.counted = true;
          this.ngZone.run(() => this.animateCounters());
          // No need to keep observing once triggered
          this.observer.disconnect();
        }
      },
      {
        // Fire when at least 10% of the stats container is visible.
        // Lowering this to 0 would fire the moment even 1px enters the
        // viewport — useful on small screens where the section is tall.
        threshold: 0.1,
      }
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
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
          stat.display   = Math.round(easeOut(progress) * stat.num);
          if (progress < 1) requestAnimationFrame(tick);
          else stat.display = stat.num;
        };

        requestAnimationFrame(tick);
      }, i * STAGGER);
    });
  }
}