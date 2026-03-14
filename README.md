# Jothi Sankar G — Portfolio (Angular v20)

A standalone Angular application portfolio — no NgModules, fully component-based.

## Structure

```
src/
├── app/
│   ├── app.component.ts          # Root component, imports all feature components
│   └── components/
│       ├── nav/                  # Sticky nav with scroll + hamburger
│       ├── hero/                 # Animated hero section
│       ├── ticker/               # Infinite marquee ticker
│       ├── work/                 # Project cards with IntersectionObserver reveal
│       ├── skills/               # Skills grid
│       ├── about/                # About + animated counters
│       ├── contact/              # Contact section
│       └── footer/               # Footer
├── styles/
│   └── styles.scss               # Global CSS variables, resets, utilities
├── index.html
└── main.ts
```

## Getting Started

```bash
npm install
npm start           # Dev server at http://localhost:4200
npm run build       # Production build
```

## Key Angular Patterns Used

- **Standalone Components** — no NgModule, each component is self-contained
- **AfterViewInit + IntersectionObserver** — scroll-triggered reveal animations
- **@ViewChildren / @ViewChild** — direct DOM reference for observers
- **@HostListener** — scroll events for nav state
- **SCSS with CSS variables** — theming via `:root` variables, component-scoped styles
- **NgFor with typed interfaces** — strongly typed project/skills data
