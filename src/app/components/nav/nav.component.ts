import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { ThemeService } from '../../services/themes.service';
import { ArchitectureModelService } from '../../services/architecture-model.service';
import { Theme } from 'src/app/models/model';
import { LogoComponent } from 'src/app/components/logo/logo';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(window:scroll)": "onScroll()",
    "(document:keydown.escape)": "onEscape()",
    "(document:click)": "onDocClick($event)",
  },
})
export class NavComponent implements OnInit, OnDestroy {
  readonly isScrolled = signal(false);
  readonly menuOpen = signal(false);
  paletteOpen = signal(false);
  activeSection = signal<string>('home');

  private observer!: IntersectionObserver;
  private analytics = inject(AnalyticsService);
  readonly themeService = inject(ThemeService);
  private readonly architectureModel = inject(ArchitectureModelService);
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

  onScroll(): void {
    if (!this.isBrowser) return;
    this.isScrolled.set(window.scrollY > 60);
  }

  onEscape(): void {
    this.paletteOpen.set(false);
  }

  // Close palette when clicking outside
  onDocClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.theme-switcher')) {
      this.paletteOpen.set(false);
    }
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  openArchitecture(): void {
    this.architectureModel.open();
    this.closeMenu();
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