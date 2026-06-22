import { Injectable, signal, effect } from '@angular/core';
import { ThemeMeta, Theme } from '../models/model';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  readonly themes: ThemeMeta[] = [
    { id: 'purple', label: 'Purple',  swatch: '#a855f7' },
    { id: 'teal',   label: 'Teal',    swatch: '#2dd4bf' },
    { id: 'amber',  label: 'Amber',   swatch: '#f59e0b' },
    { id: 'rose',   label: 'Rose',    swatch: '#f43f5e' },
  ];

  readonly current = signal<Theme>(this.savedTheme());

  constructor() {
    // Whenever the signal changes, apply it to <html> and persist
    effect(() => {
      const theme = this.current();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
    });
  }

  /**
   * Switch theme with a circular clip-path reveal expanding
   * from the point where the user clicked the swatch.
   */
  switchTheme(theme: Theme, originX: number, originY: number): void {
    if (theme === this.current()) return;

    // Bail out for users who prefer reduced motion — just swap instantly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.current.set(theme);
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'theme-reveal-overlay';
    overlay.setAttribute('data-theme', theme);

    // Max radius needed to cover the entire viewport from the click point
    const maxRadius = Math.hypot(
      Math.max(originX, window.innerWidth  - originX),
      Math.max(originY, window.innerHeight - originY)
    );

    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99998;
      pointer-events: none;
      clip-path: circle(0px at ${originX}px ${originY}px);
      transition: clip-path 600ms cubic-bezier(0.4, 0, 0.2, 1);
    `;

    document.body.appendChild(overlay);

    // Force reflow so the transition picks up the starting state
    overlay.getBoundingClientRect();

    overlay.style.clipPath = `circle(${maxRadius}px at ${originX}px ${originY}px)`;

    overlay.addEventListener('transitionend', () => {
      this.current.set(theme);
      document.body.removeChild(overlay);
    }, { once: true });
  }

  private savedTheme(): Theme {
    const saved = localStorage.getItem('portfolio-theme') as Theme | null;
    const valid: Theme[] = ['purple', 'teal', 'amber', 'rose'];
    return saved && valid.includes(saved) ? saved : 'purple';
  }
}