# Jothi Sankar G — Portfolio

Personal portfolio built with **Angular 20** — standalone components, signals, zoneless change detection, and Angular SSR prerendering.

🌐 **Live:** [jothisankar27.github.io/my-portfolio](https://jothisankar27.github.io/my-portfolio/)

---

## Tech Stack

| Layer        | Technology                                                   |
|--------------|--------------------------------------------------------------|
| Framework    | Angular 20 (standalone, zoneless)                            |
| Language     | TypeScript 5.8                                               |
| Runtime      | Node 24 (set explicitly in CI; `src/.nvmrc` for local use)   |
| Styling      | SCSS + CSS custom properties (3-theme system)                |
| Rendering    | Angular SSR — static prerendering via `RenderMode.Prerender` |
| Analytics    | Google Analytics 4 (GA4)                                     |
| Contact      | Web3Forms                                                    |
| Social card  | Satori + resvg — PNG generated at build time                 |
| Linting      | angular-eslint + typescript-eslint                           |
| CI/CD        | GitHub Actions → GitHub Pages                                |
| Dependencies | Updated manually (Dependabot is currently off)               |

---

## Getting Started

```bash
nvm use 24         # or any Node 24 install
npm ci             # install exactly what package-lock.json specifies
# create src/environments/environment.ts first — see "Environment & secrets"
npm start          # dev server
npm run lint       # angular-eslint
npm run og         # regenerate the social preview image (src/assets/og-preview.png)
npx ng build --base-href /my-portfolio/ --configuration production
```

`npm run build` runs `npm run og` first (via `prebuild`). Calling `npx ng build` directly skips it, which is why CI has its own OG step.

---

## Environment & secrets

`src/environments/environment.ts` is git-ignored. Locally you create it by hand; CI generates it from repository secrets.

```ts
export const environment = {
  web3Formslink: 'https://api.web3forms.com/submit',
  web3formsKey: '<contact form access key>',
  web3formsPingKey: '<resume-ping access key>',
};
```

| GitHub secret         | Goes into                       | Used by                                   |
|-----------------------|---------------------------------|-------------------------------------------|
| `WEB3FORMS_URL`       | `environment.web3Formslink`     | Contact form and resume ping              |
| `WEB3FORMS_KEY`       | `environment.web3formsKey`      | Contact form messages                     |
| `WEB3FORMS_PING_KEY`  | `environment.web3formsPingKey`  | Resume-access email                       |

Add them as **repository** secrets (Settings → Secrets and variables → Actions). The build job does not use a GitHub Environment, so environment-scoped secrets are not visible to it. All three are bundled into the client JavaScript, so treat them as public.


## CI/CD

Everything lives in `.github/`.

| File                         | Purpose                                                                 |
|------------------------------|-------------------------------------------------------------------------|
| `workflows/deploy.yml`       | Build, smoke-check and deploy to GitHub Pages                           |
| `../src/.nvmrc`              | Node version for local use. CI sets Node 24 explicitly in the workflow  |
| `../scripts/generate-og.mjs` | Renders the social preview PNG; called by the workflow and `prebuild`   |

**Triggers**

| Event                | What runs                                         |
|----------------------|---------------------------------------------------|
| Push to `main`       | Build → smoke check → deploy                      |
| Monday 08:00 IST     | Scheduled rebuild + deploy, so build-time values (e.g. experience labels) stay fresh |
| Manual               | `workflow_dispatch` — same as a push              |

Markdown-only changes (`**.md`) do not trigger a run.

**Build job order:** checkout → Node 24 → `npm ci` → generate `environment.ts` → generate OG image → `ng build` → smoke check → upload Pages artifact. The deploy job then publishes it.

**Design notes**

- **Two jobs.** `build` runs with `contents: read` only. Only `deploy` gets `pages: write` and `id-token: write`.
- **Smoke check.** The build fails if `index.html`, the resume PDF or `assets/og-preview.png` is missing from the output, or if `index.html` has no `og:image` reference.
- **Secrets.** Passed through `env:` and written by a small Node script using `JSON.stringify`, so special characters cannot break the generated file. The build fails fast if `WEB3FORMS_KEY`, `WEB3FORMS_URL` or `WEB3FORMS_PING_KEY` is empty.
- **Concurrency.** Runs share one `pages` group and are never cancelled mid-flight; a newer run waits for the current one.
- **No lint or test step yet.** `npm run lint` passes locally but is not part of the pipeline.

---

## Contact form & spam protection

Web3Forms access keys are public once they are in the bundle, so anyone can post to the endpoint directly and the checks below cannot stop that. They filter simple form-filling bots. Web3Forms also runs its own server-side spam check on submissions.

| Layer | Where it runs | What it does |
|-------|---------------|--------------|
| Honeypot (`hp_trap`) | Browser | Off-screen field styled inline. If filled, the form reports success and sends nothing. The name avoids `website`/`url`/`company`, which browsers autofill. |
| Timing check | Browser | Requires 2 s between the first field focus and submit. A failure shows the error banner, not a fake success, so a real visitor can retry. |

There is no captcha. Do not enable hCaptcha on either Web3Forms key, because the form sends no captcha token and every submission would be rejected.

### Resume-access email

`AnalyticsService` posts a silent notification when the resume is downloaded or opened. It uses its **own** access key (`WEB3FORMS_PING_KEY`) so that this endpoint can be disabled or rotated if it is abused, without affecting the contact form.

- At most one ping per browser per 24 hours (`localStorage`), and one per page load if storage is blocked.
- Skipped when `navigator.webdriver` is set.
- `?ref=` is reduced to letters, digits, `_`, `.`, `-` and 40 characters; the referrer is reduced to its origin.
- The Web3Forms free plan allows 250 submissions a month. Whether that is counted per key or per account is unconfirmed, hence the cooldown.

---

## Social preview image

`scripts/generate-og.mjs` renders `src/assets/og-preview.png` (1200×630) with Satori and resvg, using DM Serif Display, Outfit and DM Mono from `@fontsource/*` (no network fetch). The file is git-ignored and regenerated on every CI run and every `npm run build`. `index.html` points `og:image` and `twitter:image` at `https://jothisankar27.github.io/my-portfolio/assets/og-preview.png`.

The name, role and URL are constants at the top of the script. After deploying, LinkedIn caches previews, so re-scrape the URL in its Post Inspector to see changes.

---

## Project Structure

```
.github/
└── workflows/
    └── deploy.yml                         # CI / deploy pipeline
scripts/
└── generate-og.mjs                        # Build-time social preview image (Satori + resvg)
src/
├── .nvmrc                                 # Node version for local use
├── app/
│   ├── app.component.ts/html              # Root — composes all feature components
│   ├── app.config.server.ts               # SSR server config — merges app + server providers
│   ├── app.routes.server.ts               # Server routes — RenderMode.Prerender for all paths
│   ├── models/
│   │   └── model.ts                       # Shared interfaces and types (Project, Evidence, Theme, TimelineEvent, ...)
│   ├── services/
│   │   ├── analytics.service.ts           # GA4 wrapper — section dwell timing, resume-access email (own key, 24 h cooldown)
│   │   ├── themes.service.ts              # Signal-based theme switching, localStorage persistence, clip-path reveal
│   │   └── architecture-model.service.ts  # Shared open/close signal for the "Peek under the hood" modal
│   └── components/
│       ├── about/                         # Bio + animated stat counters
│       ├── architecture-model/            # "Peek under the hood" — animated narrative diagram + features list
│       ├── command-palette/               # Cmd/Ctrl+K — navigate, connect, theme switching, architecture view
│       ├── contact/                       # Web3Forms form — honeypot, timing check, signal state machine
│       ├── details/                       # Resume quick-facts, hourly-refreshed experience labels
│       ├── floating-component/            # Floating resume download button
│       ├── footer/                        # Footer with "site updated" badge from the GitHub commits API
│       ├── hero/                          # Multilingual name swipe (EN / TA / HI), mobile auto-crossfade
│       ├── lightbox/                      # Certificate/award evidence viewer
│       ├── nav/                           # Sticky nav, active-section highlight, theme palette, architecture trigger
│       ├── skills/                        # Icon logo wall grouped by category, certified tiles open the lightbox
│       ├── timeline/                      # Vertical career timeline with live pulse on current role
│       └── work/                          # Scroll-snap project deck with jump-to-card dots
├── assets/                                # SVG icons, images, documents (resume, certificates); og-preview.png is generated
├── environments/                          # environment.ts — git-ignored, generated in CI
├── styles/
│   └── styles.scss                        # Global CSS variables, resets, utilities, scroll progress bar
├── index.html                             # Meta tags (Open Graph + Twitter card), GA4 script
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
| Sticky nav + shrink        | `nav`                 | `@HostListener` scroll, height transition                                           |
| Active section highlight   | `nav`                 | `IntersectionObserver` across section IDs                                           |
| Theme switcher             | `nav`                 | Graphite / Synthwave / Newspaper, circular clip-path reveal from click origin       |
| "Peek under the hood"      | `nav`                 | Opens the architecture modal                                                        |
| Command palette            | `command-palette`     | Cmd/Ctrl+K — Navigate, Connect (email, LinkedIn, GitHub, resume), Theme, architecture |
| Architecture walkthrough   | `architecture-model`  | Animated step-by-step diagram (page load → interaction → redeploy) plus a features list |
| Experience labels          | `details`             | `computed()` labels driven by a `now` signal refreshed hourly in the browser        |
| Career timeline            | `timeline`            | Vertical layout, live pulse on current role                                         |
| Animated stats             | `about`               | Counter animation on the stat tiles                                                 |
| Skills logo wall           | `skills`              | Category-grouped icon tiles; certified tiles open evidence in the lightbox          |
| Project deck               | `work`                | Scroll-snap cards with jump-to-card dot markers                                     |
| Certificate/award lightbox | `lightbox`            | Image / PDF evidence viewer                                                         |
| Contact form               | `contact`             | Reactive form, signal state machine, honeypot + timing check                        |
| Resume download button     | `floating-component`  | Floating link, tracked through `AnalyticsService`                                   |
| Resume access notification | `analytics.service`   | Silent email on resume download/view via a separate key; 24 h cooldown per browser; sanitised referrer origin and `?ref=` |
| Social preview image       | `scripts/`            | 1200×630 PNG generated at build time; Open Graph + Twitter card tags                |
| Section dwell tracking     | `analytics.service`   | `performance.now()` timers, reported to GA4                                         |
| Site-updated badge         | `footer`              | Latest commit time from the GitHub API, fetched after first render                  |
| Scroll progress bar        | `app`                 | CSS `animation-timeline: scroll()` with `@supports` fallback                        |
| SSR prerendering           | `app`                 | `RenderMode.Prerender` — full HTML in the first response                            |

---

## Angular Patterns Used

| Pattern                              | Applied In                                                                       |
|--------------------------------------|----------------------------------------------------------------------------------|
| **Standalone components**            | All 13 components — no NgModule anywhere                                         |
| **Zoneless change detection**        | `provideZonelessChangeDetection()` in `main.ts`; `polyfills` is empty in `angular.json` |
| **`ChangeDetectionStrategy.OnPush`** | `hero`, `nav`, `work`, `architecture-model`                                      |
| **`signal()` / `computed()`**        | Theme, active section, palette state, active project, modal open/view state, experience labels |
| **`effect()`**                       | `ThemeService` — syncs the theme signal to the `document` attribute and `localStorage` |
| **`inject()`**                       | Services and platform tokens across components                                   |
| **`PLATFORM_ID` + `isPlatformBrowser`** | `ThemeService`, `nav`, `hero`, `work`, `details`, `lightbox`, `command-palette` — guards browser-only APIs during prerender |
| **`afterNextRender()`**              | `footer` — SSR-safe HTTP call for the commits API                                |
| **`@for` / `@if`**                   | Template iteration and conditionals                                              |
| **`@HostListener`**                  | Scroll, Escape, outside-click and touch handling                                 |
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