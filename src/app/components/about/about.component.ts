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
  @ViewChild("sectionHeader") sectionHeader!: ElementRef;

  stats = [
    { 
      num: 4,  
      label: "Years experience",          
      display: null as number | null },
    { 
      num: 3,  
      label: "Angular version migrations", 
      display: null as number | null },
    { 
      num: 2,  
      label: "Enterprise platforms",       
      display: null as number | null },
  ];

  ngAfterViewInit(): void {
    const headerObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          headerObs.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    headerObs.observe(this.sectionHeader.nativeElement);

    const statsObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            this.animateCounters();
            statsObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    statsObs.observe(this.statsSection.nativeElement);
  }

  private animateCounters(): void {
    const DURATION = 1400; // ms — total animation time per counter
    const STAGGER  = 120;  // ms — delay between each counter starting

    // Cubic ease-out: fast start, gradual deceleration to final value.
    // t is progress 0→1, returns eased progress 0→1.
    const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

    this.stats.forEach((stat, i) => {
      // Stagger: each counter waits a little longer than the previous
      setTimeout(() => {
        const startTime = performance.now();

        const tick = (now: number) => {
          const elapsed  = now - startTime;
          const progress = Math.min(elapsed / DURATION, 1);       // clamp to 1
          const eased    = easeOut(progress);

          stat.display = Math.round(eased * stat.num);

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            stat.display = stat.num; // guarantee exact final value
          }
        };

        requestAnimationFrame(tick);
      }, i * STAGGER);
    });
  }
}
