# CLAUDE.md — Portfolio Project Context

> This file is the single source of truth for Claude Code working on this Angular v20 portfolio. Read it before touching any file.

---

## Project Overview

Personal portfolio site for **Jothi Sankar GnanaSambandam** — Senior Systems Engineer (Frontend) at Infosys, Bengaluru. Deployed to **GitHub Pages** (static hosting only — no server-side execution, no Node.js runtime).

**Stack:** Angular v20 · Standalone components · TypeScript · SCSS with CSS custom properties · GitHub Pages

---

## Architecture Constraints

### CSS-First Animations (Critical)
Scroll-driven animations use **CSS `animation-timeline: scroll()` and `view()`** — not JavaScript IntersectionObserver or scroll event listeners. This was a deliberate performance refactor. Do not revert to JS-based scroll detection or add new IntersectionObservers for animation purposes.

Exception: The nav `IntersectionObserver` is for **active-state detection only** (not animation), and is intentional.

### Static Hosting
GitHub Pages serves static files. No SSR, no API routes, no backend. All dynamic behaviour is client-side only. The contact form uses **Web3Forms** with native `fetch()` / Angular `HttpClient` + `FormData` (not JSON body) to avoid CORS issues on mobile.

### No HttpClient for Contact
The contact form intentionally uses `FormData` with Web3Forms — not JSON. Do not refactor to JSON body; it breaks on mobile.

---

## Component Map

| Component | Section ID | Notes |
|---|---|---|
| `app-nav` | — | IntersectionObserver for active section; scroll detection for background |
| `app-details` | `#home` | Hero section; swipe/drag to cycle name between EN / Tamil / Hindi scripts |
| `app-ticker` | — | Horizontal scrolling ticker |
| `app-timeline` | `#timeline` | Section 01 — Career Journey |
| `app-work` | `#work` | Section 02 — tab-strip + animated card deck |
| `app-skills` | `#skills` | Section 03 — proficiency bars + pill groups |
| `app-about` | `#about` | Section 04 — bio + stats |
| `app-contact` | `#contact` | Web3Forms; signals-based form state |
| `app-footer` | — | Minimal footer |
| `app-workpanel` | — | Slide-in overlay panel; triggered by WorkPanelService |
| `app-scroll-element` | — | Spider-Man SVG scroll tracker (currently commented out) |

**Section numbering:** Timeline = 01, Work = 02, Skills = 03, About = 04

---

## Services

### `WorkPanelService`
- Angular signals: `isOpen`, `activeChip`
- `open()` sets overflow hidden; `close()` restores it
- `activeChip` type: `'oms' | 'meridian' | null`
- Opened from `DetailsComponent` hero CTA ("View My Work")

### `AnalyticsService`
- Wraps GA4 `gtag()` calls
- Guards against `gtag` being undefined (graceful no-op if GA not loaded)
- Tracked events: `resume_download`, `contact_form_submit`, `work_panel_open`

---

## Data Model

```typescript
interface Project {
  tag: string;
  stack: string;
  title: string;
  titleLine2: string;
  desc: string;
  bullets: string[];
  award?: { text: string; year: number }[];
}

interface TimelineEvent {
  year: string;
  role: string;
  place: string;
  desc: string;
  type: 'work' | 'milestone';
  current?: boolean;
}

interface SkillBar {
  name: string;
  level: number;
}
```

---

## Design System

### Colours (CSS custom properties — defined in global SCSS)
- **Accent:** purple family
- **Background:** dark
- **Noise overlay:** `.noise` pseudo-element on app root

### Typography
- **DM Serif Display** — headings / hero name
- **DM Mono** — monospaced accents, section numbers
- **Outfit** — body copy

### Patterns
- Section headers: `<span class="section-num">0N</span><h2>Title</h2>`
- Reveal animations: `.reveal` class on containers; CSS `view()` drives entrance
- Alt background sections: `.section-alt-bg` wrapper around section
- Stack pills: `.stack-pill` — split on ` · ` delimiter

---

## Known Decisions & History

- **Swipe on hero name:** Left/right drag/swipe cycles the name between English, Tamil, Hindi. Hint state signal: `'hidden' | 'click' | 'drag'`. Do not remove the hint span — it's always in DOM to prevent layout shift.
- **Work panel images:** Both OMS and Meridian `images: []` arrays are empty — NDA-restricted enterprise screenshots. The empty state shows a "Screenshots Restricted" message. Do not add placeholder images.
- **TCS offer added to timeline:** The topmost timeline entry (year: 2026) reflects an accepted offer at TCS. `current: false` intentionally — the Infosys entry has `current: true` (still serving notice).
- **Spider-Man scroll tracker** is commented out in `app.component.html` — preserved but inactive.
- **Resume PDF** is at `assets/Jothi Sankar Resume 2026.pdf` — linked from hero download button.
- **`ChangeDetectorRef` in WorkComponent** — manual `detectChanges()` is intentional for the card flip animation timing. Do not remove.
- **Contact form** uses `environment.web3formsKey` and `environment.web3Fromslink` (note the typo in the env key — match it exactly when referencing).

---

## What NOT To Do

- Do not add `localStorage` or `sessionStorage` — GitHub Pages is served with no user sessions.
- Do not add IntersectionObserver-based animations — the CSS `view()` approach is intentional.
- Do not switch contact form to JSON body — FormData is required for Web3Forms CORS compatibility.
- Do not introduce a router or lazy-loaded routes — this is a single-page scroll portfolio, not a routed app.
- Do not add a magnetic cursor, light/dark mode toggle, or other purely cosmetic features without a functional purpose.
- Do not add `HttpClient` for the contact form — it already uses `HttpClient` with `FormData`; do not switch the payload to JSON.

---

## CI/CD

Workflow file: `.github/workflows/deploy.yml` — triggers on push to `main` and `workflow_dispatch`.

### Key facts
- **Build output path:** `dist/portfolio/browser` — the Angular project name in `angular.json` is `portfolio`, not `my-portfolio`. Do not assume `dist/my-portfolio/browser`.
- **Base href:** `/my-portfolio/` — matches the GitHub Pages URL subdirectory. Do not change this.
- **Environment file:** `src/environments/` is fully gitignored including the folder itself. The workflow creates it at runtime via a generate step — do not attempt to commit environment files.
- **Node version:** App builds on Node 22. `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` is set on the job to silence the action runner deprecation warning — this is intentional, do not remove it.
- **No lint job:** `angular-eslint` is not installed. Do not add an `ng lint` step until `ng add angular-eslint` has been run locally and committed.
- **No test job:** Angular v20 test runner flags (`--no-watch --browsers ChromeHeadless`) are incompatible with the current setup. Add back when real specs exist.

### GitHub Secrets required
| Secret | Purpose |
|---|---|
| `WEB3FORMS_KEY` | Web3Forms API key for contact form |
| `WEB3FORMS_URL` | `https://api.web3forms.com/submit` |

### Generate environment step (must stay in workflow)
```yaml
- name: Generate environment file
  run: |
    mkdir -p src/environments
    cat > src/environments/environment.ts << ENVEOF
    export const environment = {
      production: true,
      web3formsKey: '${{ secrets.WEB3FORMS_KEY }}',
      web3Fromslink: '${{ secrets.WEB3FORMS_URL }}'
    };
    ENVEOF
```
Note the `mkdir -p` — the folder does not exist in the cloned repo and must be created before writing the file.

### Pages source setting
Repo → Settings → Pages → Source must be set to **GitHub Actions** (not "Deploy from a branch"). Without this the deploy step succeeds but nothing publishes.

---

## Pending / Planned Work

- Work panel screenshots: add real assets to `assets/oms/` and `assets/meridian/` when available.
- About section "Stay tuned" block — placeholder for personal/side projects, will be expanded later.
- GA4 analytics already wired up via `AnalyticsService`; future events can be added there.
- `angular-eslint` not yet installed — run `ng add angular-eslint` locally and re-add the lint job to the workflow when ready.
- `prefers-reduced-motion` overrides missing from CSS animations — add `@media (prefers-reduced-motion: reduce)` fallbacks to component SCSS files.
- Focus trap not implemented on `WorkPanelComponent` — keyboard users can tab out into the frozen background.
- OG meta tags and JSON-LD Person schema not yet added to `index.html`.
- `robots.txt` and `sitemap.xml` not yet added — place in `src/` (not repo root) so Angular copies them into the build output via the `assets` array in `angular.json`.