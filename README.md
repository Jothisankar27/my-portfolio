# Jothi Sankar G — Portfolio

Personal portfolio built with **Angular 20** — standalone components, signals-first, zero NgModules.

🌐 **Live:** [jothisankar27.github.io/my-portfolio](https://jothisankar27.github.io/my-portfolio/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 20 (standalone) |
| Language | TypeScript 5.8 |
| Styling | SCSS + CSS custom properties |
| Analytics | Google Analytics 4 (GA4) |
| Contact | Web3Forms |
| Linting | angular-eslint + typescript-eslint |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Project Structure

```
src/
├── app/
│   ├── app.component.ts/html         # Root — imports and composes all feature components
│   ├── models/
│   │   └── model.ts                  # Shared interfaces: Project, SkillBar, FormModel, TimelineEvent
│   ├── services/
│   │   ├── analytics.service.ts      # GA4 wrapper — events, resume downloads, section dwell timing
│   │   └── workpanel.service.ts      # Signal-based open/close + active chip state
│   └── components/
│       ├── about/                    # Bio, GitHub contribution heatmap, animated stat counters
│       ├── contact/                  # Web3Forms submission with signal state machine + social links
│       ├── details/                  # Hero — multilingual name swipe (EN / TA / HI), entrance animations
│       ├── footer/                   # Minimal footer
│       ├── nav/                      # Sticky nav, active-section highlight, hamburger menu
│       ├── scroll-element/           # Spider-Man scroll progress indicator (opt-in)
│       ├── skills/                   # Two-column proficiency bars + categorised skill pills
│       ├── ticker/                   # Infinite seamless marquee with edge-fade mask
│       ├── timeline/                 # Vertical career timeline with live-pulse on current role
│       ├── work/                     # Tabbed project cards with flicker-free animations
│       └── workpanel/                # Slide-in detail panel for work projects
├── assets/                           # SVG icons, images, resume PDF
├── styles/
│   └── styles.scss                   # Global CSS variables, resets, utilities, scroll progress bar
├── index.html
└── main.ts
```

---

## Architecture

```
AppComponent (root)
│
├── NavComponent
│   └── IntersectionObserver → tracks active section, fires dwell events via AnalyticsService
│
├── DetailsComponent
│   ├── Multilingual swipe (EN / TA / HI) via mouse + touch HostListeners
│   └── Injects WorkPanelService + AnalyticsService
│
├── TickerComponent         — infinite CSS marquee
│
├── TimelineComponent       — career journey, vertical layout
│
├── WorkComponent
│   ├── signal(activeIndex) + ChangeDetectorRef → flicker-free card transitions
│   └── WorkPanelService.open() → triggers slide-in panel
│
├── WorkPanelComponent
│   └── Driven entirely by WorkPanelService signals (isOpen, activeChip)
│
├── SkillsComponent         — two-column bars, IntersectionObserver fill trigger
│
├── AboutComponent
│   └── IntersectionObserver → RAF cubic ease-out stat counters (NgZone-aware)
│
├── ContactComponent        — signal state machine: idle → sending → success/error
│
├── FooterComponent
│
└── ScrollElement           — Spider-Man SVG scroll indicator (opt-in)

Services (providedIn: 'root')
├── AnalyticsService        — GA4 event wrapper, section dwell timers via performance.now()
└── WorkPanelService        — signal(isOpen), signal(activeChip), body scroll lock
```

---

## Features

| Feature | Component | Detail |
|---|---|---|
| Multilingual name swipe | `details` | Mouse + touch drag, 48 px threshold — English / Tamil / Hindi |
| Hero entrance animations | `details` | CSS keyframes, staggered reveal, hint state signal |
| Sticky nav + shrink | `nav` | `@HostListener` scroll, height transition at 60 px |
| Active section highlight | `nav` | `IntersectionObserver` across all section IDs, `rootMargin` tuned to nav height |
| Section dwell tracking | `nav` | `performance.now()` timers in `AnalyticsService`, sub-1 s blips ignored |
| Career timeline | `timeline` | Vertical layout, work / milestone dot types, live pulse on current role |
| Animated stat counters | `about` | RAF cubic ease-out, 120 ms stagger, single-fire `IntersectionObserver` |
| GitHub contribution heatmap | `about` | Rendered in the About section |
| Two-column skill bars | `skills` | Frontend left / Backend right, interleaved stagger, `tabular-nums` |
| Infinite ticker | `ticker` | Gap-based spacing, `translateX(-50%)`, edge `mask-image` fade |
| Tabbed project cards | `work` | `detectChanges()` → rAF → `signal.set()` to eliminate flicker |
| Work detail panel | `workpanel` | Slide-in overlay, body scroll lock, driven by `WorkPanelService` |
| Contact form | `contact` | Signal state machine: `idle → sending → success / error` |
| Resume download tracking | `details` | GA4 `resume_download` event via `AnalyticsService` |
| Work panel open tracking | `workpanel` | GA4 `work_panel_open` event per project name |
| CSS scroll progress bar | `app` | Pure CSS `.scroll-progress-bar` in root template |
| Spider-Man scroll indicator | `scroll-element` | Opt-in — uncomment `<app-scroll-element>` in `app.component.html` |

---

## Angular Patterns Used

| Pattern | Applied In |
|---|---|
| **Standalone components** | Every component — no NgModule anywhere in the app |
| **`signal()` / `computed()`** | `activeIndex` (work), `isOpen` / `activeChip` (workpanel service), `activeSection` (nav), `hintState` (details) |
| **`inject()`** | Service injection across all components — no constructor injection |
| **`@for` / `@if`** | All template iteration and conditionals — no `*ngFor` / `*ngIf` |
| **`AfterViewInit` + `IntersectionObserver`** | Scroll-triggered reveals, stat counters (about), skill bar fills, active nav section |
| **`NgZone.run()`** | Brings RAF callbacks back into Angular's change detection in `AboutComponent` |
| **`ChangeDetectorRef.detectChanges()`** | Explicit DOM flush before rAF to prevent card-switch animation flicker (`work`) |
| **`requestAnimationFrame` + `performance.now()`** | Cubic ease-out stat counters and skill bar fill animations |
| **`@ViewChild` / `@ViewChildren`** | Direct DOM references for `IntersectionObserver` targets |
| **`@HostListener`** | `window:scroll` (nav shrink), `document:mousemove` / `mouseup` (name swipe in details) |
| **`OnDestroy` cleanup** | `IntersectionObserver.disconnect()` and dwell timer flush in `nav`, `about` |
| **SCSS + CSS custom properties** | Full theming via `:root`, component-scoped styles |
| **`prefers-reduced-motion`** | Guards on all CSS keyframe animations and JS-driven transitions |
| **CSS `animation-timeline: view()`** | Scroll-driven animations with `@supports` progressive enhancement |
| **`HttpClient` + `FormData`** | Native multipart submission to Web3Forms (no manual `Content-Type` header) |

---

## Getting Started

```bash
npm install
npm start        # dev server → http://localhost:4200
npm run build    # production build
```