# Jothi Sankar G — Portfolio (Angular v20)

A standalone Angular application portfolio — no NgModules, fully component-based.

## Structure

```
src/
├── app/
│   ├── app.component.ts        # Root component, imports all feature components
│   ├── app.component.html
|   ├── models/
|   |   ├── model.ts            # Shared interfaces: Project, SkillBar, FormModel, TimelineEvent
│   └── components/
│       ├── about/              # Bio + animated stat counters via IntersectionObserver
│       ├── contact/            # Web3Forms contact form with signal-based state + social links
│       ├── details/            # Hero — multilingual name swipe, entrance animations
│       ├── footer/             # Minimal footer
│       ├── nav/                # Sticky nav, active section highlight, hamburger
│       ├── scroll-element/     # Spider-Man scroll progress (currently disabled)
│       ├── skills/             # Two-column proficiency bars + categorised pills
│       ├── ticker/             # Infinite seamless marquee with edge fade
│       ├── timeline/           # Career journey vertical timeline (new)
│       └── work/               # Tabbed project cards with flicker-free animations
├── assets/                     # Icons svg, images, resume
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
- **Signals** — `signal()`, `computed()`, and `inject()` for reactive state (work card switching, contact form status)
- **ChangeDetectorRef** — explicit `detectChanges()` to sequence DOM flushes and prevent animation flicker
- **AfterViewInit + IntersectionObserver** — scroll-triggered reveals, self-drawing section dividers, bar animations, stat counters
- **@ViewChild / @ViewChildren** — direct DOM references for observers and template refs
- **@HostListener** — scroll and mouse events for nav shrink and swipe detection
- **SCSS with CSS variables** — full theming via `:root`, component-scoped styles, `prefers-reduced-motion` guards
- **RAF-based animations** — `requestAnimationFrame` with cubic ease-out for stat counters and skill bars, `performance.now()` for time-based progress
- **Angular control flow** — `@for` and `@if` instead of legacy `*ngFor` / `*ngIf`
- **HttpClient + FormData** — native multipart form submission for Web3Forms (no JSON, no manual Content-Type header)

## Features

| Feature                       | Component        | Implementation                                                            |
|-------------------------------|------------------|---------------------------------------------------------------------------|
| Multilingual name swipe       | `details`        | Mouse + touch drag with real-time threshold detection, English / Tamil / Hindi |
| Self-drawing section dividers | `styles.scss`    | `::after` `scaleX(0→1)` on IntersectionObserver `.visible`                |
| Flicker-free card switching   | `work`           | `detectChanges()` → `rAF` → `signal.set()` sequencing                     |
| Seamless ticker loop          | `ticker`         | Gap-based spacing, `translateX(-50%)`, edge `mask-image` fade             |
| Active nav highlight          | `nav`            | IntersectionObserver on all section IDs, `rootMargin` tuned to nav height |
| Career timeline               | `timeline`       | Vertical timeline with work / milestone dot types and current pulse       |
| Animated stat counters        | `about`          | RAF cubic ease-out, 120ms stagger, IntersectionObserver trigger           |
| Two-column skill bars         | `skills`         | Frontend left / Backend right, interleaved stagger, `tabular-nums`        |
| Web3Forms contact             | `contact`        | Signal state machine (idle → sending → success / error), FormData submit  |
| Scroll progress bar           | `app`            | CSS-only `.scroll-progress-bar` element in root template                  |
| Scroll progress indicator     | `scroll-element` | Spider-Man SVG — uncomment in `app.component.html` to enable              |
