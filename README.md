# Jothi Sankar G — Portfolio

Personal portfolio built with **Angular 20** — standalone components, signals-first, zoneless change detection, Angular SSR prerendering.

🌐 **Live:** [jothisankar27.github.io/my-portfolio](https://jothisankar27.github.io/my-portfolio/)

---

## Tech Stack

| Layer     | Technology                                                   |
|-----------|--------------------------------------------------------------|
| Framework | Angular 20 (standalone, zoneless)                            |
| Language  | TypeScript 5.8                                               |
| Styling   | SCSS + CSS custom properties (7-theme system)                |
| Rendering | Angular SSR — static prerendering via `RenderMode.Prerender` |
| Analytics | Google Analytics 4 (GA4)                                     |
| Contact   | Web3Forms                                                    |
| Linting   | angular-eslint + typescript-eslint                           |
| CI/CD     | GitHub Actions → GitHub Pages                                |

---

## Project Structure

```
src/
├── app/
│   ├── app.component.ts/html         # Root — imports and composes all feature components
│   ├── app.config.server.ts          # SSR server config — merges app + server providers
│   ├── app.routes.server.ts          # Server routes — RenderMode.Prerender for all paths
│   ├── models/
│   │   └── model.ts                  # Shared interfaces: Project, ThemeMeta, Theme, Stat, TimelineEvent
│   ├── services/
│   │   ├── analytics.service.ts      # GA4 wrapper — section dwell timing via performance.now()
│   │   └── themes.service.ts         # Signal-based theme switching, localStorage persistence, clip-path reveal
│   └── components/
│       ├── about/                    # Bio, animated stat counters (afterNextRender + IntersectionObserver)
│       ├── contact/                  # Web3Forms submission with signal state machine + social links
│       ├── details/                  # Hero — multilingual name swipe (EN / TA / HI), entrance animations
│       ├── footer/                   # Minimal footer
│       ├── nav/                      # Sticky nav, active-section highlight, theme palette, hamburger menu
│       ├── scroll-element/           # Spider-Man scroll progress indicator (opt-in)
│       ├── skills/                   # 3-tier proficiency matrix (Expert / Proficient / Familiar) + skill grid
│       ├── ticker/                   # Infinite seamless marquee with edge-fade mask
│       ├── timeline/                 # Vertical career timeline with live-pulse on current role
│       └── work/                     # Tabbed project cards with flicker-free enter/exit animations
├── assets/                           # SVG icons, images, resume PDF
├── styles/
│   └── styles.scss                   # Global CSS variables, resets, utilities, scroll progress bar
├── index.html                        # OG meta tags, GA4 script
├── main.ts                           # Browser bootstrap — zoneless, provideClientHydration
├── main.server.ts                    # Server bootstrap — consumes app.config.server
└── server.ts                         # Express server for SSR (used at build time for prerender)
```

---

## Architecture

```
AppComponent (root)
│
├── NavComponent
│   ├── IntersectionObserver → tracks active section, fires dwell events via AnalyticsService
│   ├── ThemeService → swatch palette with circular clip-path reveal animation
│   └── isPlatformBrowser guard — skips DOM APIs during SSR prerender
│
├── DetailsComponent
│   ├── Multilingual swipe (EN / TA / HI) via mouse + touch HostListeners
│   └── Injects AnalyticsService
│
├── TickerComponent         — infinite CSS marquee
│
├── TimelineComponent       — career journey, vertical layout
│
├── WorkComponent           — signal(activeIndex), flicker-free card transitions
│
├── SkillsComponent         — 3-tier proficiency matrix + categorised skill grid
│
├── AboutComponent
│   └── afterNextRender() → IntersectionObserver → RAF cubic ease-out stat counters
│
├── ContactComponent        — signal state machine: idle → sending → success/error
│
├── FooterComponent
│
└── ScrollElement           — Spider-Man SVG scroll indicator (opt-in)

Services (providedIn: 'root')
├── AnalyticsService        — GA4 event wrapper, section dwell timers via performance.now()
└── ThemeService            — signal(current), 4-theme system, localStorage + isPlatformBrowser guards
```

---

## Features

| Feature                     | Component | Detail                                                                                           |
|-----------------------------|-----------|--------------------------------------------------------------------------------------------------|
| Multilingual name swipe     | `details` | Mouse + touch drag, 48 px threshold — English / Tamil / Hindi                                    |
| Hero entrance animations    | `details` | CSS keyframes, staggered reveal, hint state signal                                               |
| Sticky nav + shrink         | `nav`     | `@HostListener` scroll, height transition at 60 px                                               |
| Active section highlight    | `nav`     | `IntersectionObserver` across all section IDs, `rootMargin` tuned to nav height                  |
| Theme switcher              | `nav`     | 4 themes (Purple / Synthwave / Newspaper / Graphite), circular clip-path reveal from click origin|
| Section dwell tracking      | `nav`     | `performance.now()` timers in `AnalyticsService`                                                 |
| Career timeline             | `timeline`| Vertical layout, work / milestone dot types, live pulse on current role                          |
| Animated stat counters      | `about`   | RAF cubic ease-out, 120 ms stagger, `afterNextRender()` + single-fire `IntersectionObserver`     |
| 3-tier skills matrix        | `skills`  | Expert / Proficient / Familiar tiers + categorised skill grid                                    |
| Infinite ticker             | `ticker`  | Gap-based spacing, `translateX(-50%)`, edge `mask-image` fade                                    |
| Tabbed project cards        | `work`    | Enter/exit animations with `data-state` attribute transitions                                    |
| Contact form                | `contact` | Signal state machine: `idle → sending → success / error`                                         |
| CSS scroll progress bar     | `app`     | Pure CSS `animation-timeline: scroll()` with `@supports` fallback                                |
| SSR prerendering            | `app`     | `RenderMode.Prerender` — full HTML in first response for SEO and Google indexability             |
---

## Angular Patterns Used

| Pattern | Applied In |
|---|---|
| **Standalone components** | Every component — no NgModule anywhere |
| **Zoneless change detection** | `provideZonelessChangeDetection()` in bootstrap — no zone.js |
| **`signal()` / `computed()`** | `current` theme, `activeSection`, `paletteOpen`, `hintState`, stat `display` counters |
| **`effect()`** | ThemeService — syncs signal changes to `document` attribute + `localStorage` |
| **`inject()`** | Service injection across all components — no constructor injection |
| **`PLATFORM_ID` + `isPlatformBrowser`** | ThemeService, NavComponent — guards all `localStorage`, `document`, `window`, `IntersectionObserver` calls during SSR |
| **`afterNextRender()`** | AboutComponent — replaces `AfterViewInit` for SSR-safe DOM access |
| **`@for` / `@if`** | All template iteration and conditionals — no `*ngFor` / `*ngIf` |
| **`IntersectionObserver`** | Active nav section, stat counter trigger (both guarded with `isPlatformBrowser`) |
| **`requestAnimationFrame` + `performance.now()`** | Cubic ease-out stat counters |
| **`@HostListener`** | `window:scroll`, `document:keydown.escape`, `document:click`, touch events |
| **`OnDestroy` cleanup** | `IntersectionObserver.disconnect()` and dwell timer flush in `nav` |
| **SCSS + CSS custom properties** | 4-theme system via `data-theme` attribute on `<html>`, component-scoped styles |
| **`prefers-reduced-motion`** | Guards on all CSS keyframe animations and JS-driven transitions |
| **CSS `animation-timeline: view()`** | Scroll-driven animations with `@supports` progressive enhancement |
| **`HttpClient` + `FormData`** | Native multipart submission to Web3Forms |
| **Angular SSR** | `mergeApplicationConfig`, `provideServerRendering`, `RenderMode.Prerender` |

---

## Theming

4 CSS custom property tokens drive every colour in the app. Switching themes applies a `data-theme` attribute to `<html>` and animates a circular clip-path overlay expanding from the click origin:

| Theme            | Accent    |
|------------------|-----------|
| Purple (default) | `#a855f7` |
| Synthwave        | `#ff2d78` |
| Newspaper        | `#d4c9b0` |
| Graphite         | `#a8b8cc` |

Theme preference is persisted to `localStorage` and restored on next visit.

---

## SSR & Prerendering

Angular SSR is configured with `outputMode: static` for GitHub Pages deployment. At build time, Angular prerenders all routes to static HTML files — meaning Google and social platform crawlers receive fully rendered content in the first HTTP response without executing JavaScript.

```
ng build → dist/portfolio/browser/index.html  ← full HTML, all sections rendered
```

Browser-only APIs (`localStorage`, `IntersectionObserver`, `document`, `window`) are guarded with `isPlatformBrowser(PLATFORM_ID)` across all services and components.

---