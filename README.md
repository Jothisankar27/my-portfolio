# Jothi Sankar G — Portfolio (Angular v20)

A standalone Angular application portfolio — no NgModules, fully component-based.

## Structure

```
src/
├── app/
│   ├── app.component.ts        # Root component, imports all feature components
│   ├── app.component.html
|   ├── models/
|   |   ├── model/              # model objects
│   └── components/
│       ├── about/              # Career timeline + animated stat counters
│       ├── contact/            # Reactive form via web3forms + social links
│       ├── details/            # Hero — multilingual name swipe, entrance animations
│       ├── footer/             # Footer with live read-time + scroll depth stats
│       ├── nav/                # Sticky nav, active section highlight, hamburger
│       ├── scroll-element/     # Spider-Man scroll progress (currently disabled)
│       ├── skills/             # Two-column proficiency bars + categorised pills
│       ├── ticker/             # Infinite seamless marquee with edge fade
│       └── work/               # Tabbed project cards with flicker-free animations
├── assets/                     # Icons, images, resume PDF
├── styles/
│   └── styles.scss             # Global CSS variables, resets, utilities
├── index.html
└── main.ts
```

## Getting Started

```bash
npm install
npm start                             # Dev server at http://localhost:4200
npm run build                         # Production build
ng deploy --base-href=/Project-Name/  # Build and push to GitHub Pages
```

## Key Angular Patterns Used

- **Standalone Components** — no NgModule, each component is self-contained
- **Signals** — `signal()` and `inject()` for reactive state (work card switching)
- **ChangeDetectorRef** — explicit `detectChanges()` to sequence DOM flushes and prevent animation flicker
- **AfterViewInit + IntersectionObserver** — scroll-triggered reveals, self-drawing section dividers, bar animations, stat counters
- **@ViewChild / @ViewChildren** — direct DOM references for observers and template refs
- **@HostListener** — scroll events for nav shrink and footer scroll depth
- **SCSS with CSS variables** — full theming via `:root`, component-scoped styles, `prefers-reduced-motion` guards
- **RAF-based animations** — `requestAnimationFrame` with cubic ease-out for stat counters and skill bars, `performance.now()` for time-based progress
- **NgFor with typed interfaces** — strongly typed project, skill, and timeline data

## Features

| Feature                       | Component        | Implementation                                                            |
|-------------------------------|------------------|---------------------------------------------------------------------------|
| Multilingual name swipe       | `details`        | Mouse + touch drag, slide animations, English / Tamil / Hindi             |
| Self-drawing section dividers | `styles.scss`    | `::after` `scaleX(0→1)` on IntersectionObserver `.visible`                |
| Flicker-free card switching   | `work`           | `detectChanges()` → `rAF` → `signal.set()` sequencing                     |
| Seamless ticker loop          | `ticker`         | Gap-based spacing, `translateX(-50%)`, edge `mask-image` fade             |
| Active nav highlight          | `nav`            | IntersectionObserver on all section IDs, `rootMargin` tuned to nav height |
| Career timeline               | `about`          | `translateX` staggered reveal per node, IntersectionObserver              |
| Animated stat counters        | `about`          | RAF cubic ease-out, 120ms stagger, `null` initial state                   |
| Two-column skill bars         | `skills`         | Frontend left / Backend right, interleaved stagger, `tabular-nums`        |
| Scroll progress indicator     | `scroll-element` | Spider-Man SVG — uncomment in `app.component.html` to enable              |
