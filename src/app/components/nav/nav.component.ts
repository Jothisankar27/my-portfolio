import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { ThemeService } from '../../services/themes.service';
import { Theme } from 'src/app/models/model';

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
  paletteOpen = signal(false);
  activeSection = signal<string>('home');

  private observer!: IntersectionObserver;
  private analytics = inject(AnalyticsService);
  readonly themeService = inject(ThemeService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly sectionOrder = [
    "home",
    "timeline",
    "work",
    "skills",
    "about",
    "contact",
  ];

  ngOnInit(): void {
    if (!this.isBrowser) return;
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
      { rootMargin: '-64px 0px -45% 0px', threshold: 0 }
    );

    this.sectionOrder.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.sectionOrder.forEach((id) => this.analytics.trackSectionExit(id));
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.isBrowser) return;
    this.isScrolled = window.scrollY > 60;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.paletteOpen.set(false);
  }

  // Close palette when clicking outside
  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.theme-switcher')) {
      this.paletteOpen.set(false);
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  togglePalette(): void {
    this.paletteOpen.update(v => !v);
  }

  pickTheme(theme: Theme, event: MouseEvent): void {
    event.stopPropagation();
    this.themeService.switchTheme(theme, event.clientX, event.clientY);
    this.paletteOpen.set(false);
  }

  readonly currentSwatch = computed(() => {
    const theme = this.themeService.themes.find(
      t => t.id === this.themeService.current()
    );
    return theme?.swatch ?? '#a855f7';
  });
}