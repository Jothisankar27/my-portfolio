import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit, OnDestroy {
  isScrolled = false;
  menuOpen = false;
  activeSection = signal<string>("home");

  private observer!: IntersectionObserver;
  private analytics = inject(AnalyticsService);
  private readonly sectionOrder = [
    "home",
    "timeline",
    "work",
    "skills",
    "about",
    "contact",
  ];

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        //  Active section logic (unchanged)
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              this.sectionOrder.indexOf(a.target.id) -
              this.sectionOrder.indexOf(b.target.id)
          );

        if (intersecting.length > 0) {
          this.activeSection.set(intersecting[0].target.id);
        }

        // Dwell tracking 
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;

          if (entry.isIntersecting) {
            this.analytics.trackSectionEnter(id);
          } else {
            this.analytics.trackSectionExit(id);
          }
        });
      },
      {
        rootMargin: '-64px 0px -45% 0px',
        threshold: 0,
      },
    );

    this.sectionOrder.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    // flush any open dwell timers before component tears down
    this.sectionOrder.forEach((id) => this.analytics.trackSectionExit(id));
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 60;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
