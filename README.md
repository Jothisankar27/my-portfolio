# Jothi Sankar G — Portfolio

Personal portfolio built with **Angular 20** — standalone components, signals, zoneless change detection, and Angular SSR prerendering.

🌐 **Live:** [jothisankar27.github.io/my-portfolio](https://jothisankar27.github.io/my-portfolio/)

---

## Tech Stack

| Layer        | Technology                                                   |
|--------------|--------------------------------------------------------------|
| Framework    | Angular 20 (standalone, zoneless)                            |
| Language     | TypeScript 5.8                                               |
| Runtime      | Node 24 (set in the deploy workflow)                         |
| Styling      | SCSS + CSS custom properties (3-theme system)                |
| Rendering    | Angular SSR — static prerendering via `RenderMode.Prerender` |
| Analytics    | Google Analytics 4 (GA4)                                     |
| Contact      | Web3Forms                                                    |
| Linting      | angular-eslint + typescript-eslint                           |
| CI/CD        | GitHub Actions → GitHub Pages                                |

---

## Getting Started

```bash
npm ci             # install exactly what package-lock.json specifies
npm start          # dev server
npm run lint       # angular-eslint
npx ng build --base-href /my-portfolio/ --configuration production
```


## CI/CD

Everything lives in `.github/`.

| File                         | Purpose                                                                 |
|------------------------------|-------------------------------------------------------------------------|
| `workflows/deploy.yml`       | Build, smoke-check and deploy to GitHub Pages                           |

**Triggers**

| Event                | What runs                                         |
|----------------------|---------------------------------------------------|
| Push to `main`       | Build → smoke check → deploy                      |
| Monday 08:00 IST     | Scheduled rebuild + deploy, so build-time values (e.g. experience labels) stay fresh |
| Manual               | `workflow_dispatch` — same as a push              |

Markdown-only changes (`**.md`) do not trigger a run.

**Design notes**

- **Two jobs.** `build` runs with `contents: read` only. Only `deploy` gets `pages: write` and `id-token: write`.
- **Smoke check.** The build fails if `index.html` or the resume PDF is missing from the output.
- **Secrets.** Passed through `env:` and written by a small Node script using `JSON.stringify`, so special characters cannot break the generated file. The build fails fast if a secret is empty.
- **Concurrency.** Deploys queue and are never cancelled mid-flight.
- The Web3Forms key is bundled into the client JavaScript, so restrict it by domain in the Web3Forms dashboard.

---

## Project Structure

```
.github/
└── workflows/
    └── deploy.yml                         # CI / deploy pipeline
src/
├── app/
│   ├── app.component.ts/html              # Root — composes all feature components
│   ├── app.config.server.ts               # SSR server config — merges app + server providers
│   ├── app.routes.server.ts               # Server routes — RenderMode.Prerender for all paths
│   ├── data/                              # Single source of truth for content (typed, readonly)
│   │   ├── profile.data.ts                # Names (EN / TA / HI), location, focus, contact links, resume path
│   │   ├── career.data.ts                 # Career entries; current role and employer are derived from the current entry
│   │   ├── projects.data.ts               # Work experience cards and award evidence
│   │   ├── skills.data.ts                 # Skill categories and the GH-300 certificate evidence
│   │   ├── about.data.ts                  # "Then vs now" list
│   │   ├── education.data.ts              # Empty slot for the education block
│   │   └── structured-data.ts             # Builds schema.org Person JSON-LD from the data above
│   ├── models/
│   │   └── model.ts                       # Shared interfaces and types (Project, Evidence, Theme, TimelineEvent, Profile, ...)
│   ├── services/
│   │   ├── analytics.service.ts           # GA4 wrapper — section dwell timing, resume-access email notification
│   │   ├── structured-data.service.ts     # Adds the Person JSON-LD to <head> during prerender only
│   │   ├── themes.service.ts              # Signal-based theme switching, localStorage persistence, clip-path reveal
│   │   └── architecture-model.service.ts  # Shared open/close signal for the "Peek under the hood" modal
│   └── components/
│       ├── about/                         # Bio + "then vs now" comparison list
│       ├── architecture-model/            # "Peek under the hood" — animated narrative diagram + features list
│       ├── command-palette/               # Cmd/Ctrl+K — navigate, connect, theme switching, architecture view
│       ├── contact/                       # Web3Forms reactive form with signal state machine
│       ├── details/                       # Resume quick-facts, hourly-refreshed experience labels
│       ├── floating-component/            # Floating resume download button
│       ├── footer/                        # Footer with "site updated" badge from the GitHub commits API
│       ├── hero/                          # Multilingual name swipe (EN / TA / HI), mobile auto-crossfade
│       ├── lightbox/                      # Certificate/award evidence viewer
│       ├── nav/                           # Sticky nav, active-section highlight, theme palette, architecture trigger
│       ├── skills/                        # Icon logo wall grouped by category, certified tiles open the lightbox
│       ├── timeline/                      # Vertical career timeline with live pulse on current role
│       └── work/                          # Tabbed project cards with enter/exit animations
├── assets/                                # SVG icons, images, documents (resume, certificates)
├── environments/                          # environment.ts — git-ignored, generated in CI
├── styles/
│   └── styles.scss                        # Global CSS variables, resets, utilities, scroll progress bar
├── index.html                             # Meta tags, GA4 script
├── main.ts                                # Browser bootstrap — zoneless, hydration with event replay
├── main.server.ts                         # Server bootstrap — consumes app.config.server
└── server.ts                              # Express server entry for SSR
```

---

## Features

| Feature                    | Component             | Detail                                                                              |
|----------------------------|-----------------------|-------------------------------------------------------------------------------------|
| Multilingual name swipe    | `hero`                | Mouse + touch drag — English / Tamil / Hindi                                        |
| Mobile auto-crossfade      | `hero`                | Auto-cycles EN → TA → HI on narrow viewports                                        |
| Sticky nav + shrink        | `nav`                 | Host `(window:scroll)` listener, height transition                                  |
| Active section highlight   | `nav`                 | `IntersectionObserver` across section IDs                                           |
| Theme switcher             | `nav`                 | Graphite / Synthwave / Newspaper, circular clip-path reveal from click origin       |
| "Peek under the hood"      | `nav`                 | Opens the architecture modal                                                        |
| Command palette            | `command-palette`     | Cmd/Ctrl+K — Navigate, Connect (email, LinkedIn, GitHub, resume), Theme, architecture |
| Architecture walkthrough   | `architecture-model`  | Animated step-by-step diagram (page load → interaction → redeploy) plus a features list |
| Experience labels          | `details`             | `computed()` labels driven by a `now` signal refreshed hourly in the browser        |
| Career timeline            | `timeline`            | Vertical layout, live pulse on current role                                         |
| Then vs now                | `about`               | Struck-through "then" lines next to the "now" version                               |
| Skills logo wall           | `skills`              | Category-grouped icon tiles; certified tiles open evidence in the lightbox          |
| Tabbed project cards       | `work`                | Enter/exit animations with `data-state` transitions                                 |
| Certificate/award lightbox | `lightbox`            | Image / PDF evidence viewer                                                         |
| Contact form               | `contact`             | Reactive form, signal state machine: `idle → sending → success / error`             |
| Resume download button     | `floating-component`  | Floating link, tracked through `AnalyticsService`                                   |
| Resume access notification | `analytics.service`   | Silent Web3Forms email on resume download/view, with referrer and optional `?ref=`  |
| Section dwell tracking     | `analytics.service`   | `performance.now()` timers, reported to GA4                                         |
| Site-updated badge         | `footer`              | Latest commit time from the GitHub API, fetched after first render                  |
| Scroll progress bar        | `app`                 | CSS `animation-timeline: scroll()` with `@supports` fallback                        |
| SSR prerendering           | `app`                 | `RenderMode.Prerender` — full HTML in the first response                            |

---

## Angular Patterns Used

| Pattern                              | Applied In                                                                       |
|--------------------------------------|----------------------------------------------------------------------------------|
| **Standalone components**            | All 14 components — no NgModule anywhere                                         |
| **Zoneless change detection**        | `provideZonelessChangeDetection()` in `main.ts`; `polyfills` is empty in `angular.json` |
| **`ChangeDetectionStrategy.OnPush`** | Every component, including the root                                              |
| **`signal()` / `computed()`**        | Theme, active section, palette state, active project, modal open/view state, experience labels |
| **`effect()`**                       | `ThemeService` — syncs the theme signal to the `document` attribute and `localStorage` |
| **`inject()`**                       | Services and platform tokens across components                                   |
| **`PLATFORM_ID` + `isPlatformBrowser`** | `ThemeService`, `nav`, `hero`, `work`, `details`, `lightbox`, `command-palette` — guards browser-only APIs during prerender |
| **`afterNextRender()`**              | `footer` — SSR-safe HTTP call for the commits API                                |
| **`@for` / `@if`**                   | Template iteration and conditionals                                              |
| **`host` metadata listeners**        | Scroll, Escape, outside-click, Ctrl+K and mouse-drag handling, declared in `host` instead of `@HostListener` |
| **Signal inputs, outputs, queries**  | `input()` / `output()` on the lightbox, `viewChild()` / `viewChild.required()` in the command palette and work deck, `linkedSignal()` to reset the lightbox skeleton |
| **Typed content layer**              | `src/app/data` — readonly, shared interfaces; components import facts instead of retyping them |
| **SCSS + CSS custom properties**     | 3-theme system via `data-theme` on `<html>`, component-scoped styles             |
| **`prefers-reduced-motion`**         | Respected in the animated components, including the architecture modal           |
| **CSS `animation-timeline`**         | Scroll-driven animations with `@supports` progressive enhancement                |
| **`HttpClient` + `FormData`**        | Multipart submission to Web3Forms — contact form and resume-access notification  |
| **Angular SSR**                      | `mergeApplicationConfig`, `provideServerRendering`, `RenderMode.Prerender`       |

---

## Theming

A shared set of CSS custom property tokens (surface, text, and three accent colours) drives every colour in the app. Switching themes applies a `data-theme` attribute to `<html>` and animates a circular clip-path overlay expanding from the click origin. The preference is persisted to `localStorage` and restored on the next visit.

| Theme              | Accent    |
|--------------------|-----------|
| Graphite (default) | `#a8b8cc` |
| Synthwave          | `#ff2d78` |
| Newspaper          | `#d4c9b0` |

---

## SSR & Prerendering

Angular SSR is configured with `outputMode: static` for GitHub Pages. At build time Angular prerenders all routes to static HTML, so crawlers receive fully rendered content without executing JavaScript.

```
ng build → dist/portfolio/browser/index.html  ← full HTML, all sections rendered
```

Browser-only APIs (`localStorage`, `IntersectionObserver`, `document`, `window`) are guarded with `isPlatformBrowser(PLATFORM_ID)`.