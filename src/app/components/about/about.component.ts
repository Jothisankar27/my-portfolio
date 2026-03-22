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
  private listener!: () => void;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // Trigger the count-up the moment the CSS scroll-driven entrance
    // animation fires on the stats container — no IntersectionObserver needed.
    // Falls back to immediate count-up if animation-timeline is unsupported.
    const el = this.statsSection.nativeElement as HTMLElement;

    this.listener = () => {
      if (this.counted) return;
      this.counted = true;
      this.ngZone.run(() => this.animateCounters());
    };

    el.addEventListener('animationstart', this.listener);

    // Fallback: if CSS scroll-timeline isn't supported, the animationstart
    // event never fires — so start the counter immediately on init instead.
    if (!CSS.supports('animation-timeline', 'view()')) {
      this.animateCounters();
    }
  }

  ngOnDestroy(): void {
    this.statsSection?.nativeElement
      .removeEventListener('animationstart', this.listener);
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