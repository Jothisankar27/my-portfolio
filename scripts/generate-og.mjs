// Generates src/assets/og-preview.png (1200x630) at build time.
// Run automatically via the "prebuild" npm script.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const font = (pkg, file) =>
  readFileSync(join(dirname(require.resolve(`${pkg}/package.json`)), 'files', file));

// TODO: later import these from the single data file instead of hardcoding.
const site = {
  name: 'Jothi Sankar',
  surname: 'GnanaSambandam',
  role: 'Angular Developer · Micro-frontends',
  url: 'jothisankar27.github.io/my-portfolio',
};
const theme = { bg: '#080a0d', surface: '#0f1318', accent: '#a8b8cc', text: '#e8edf3', muted: '#7d8896' };

const h = (type, style, children) => ({ type, props: { style, children } });

const tree = h('div', {
  width: 1200, height: 630, boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
  justifyContent: 'space-between', padding: 72, background: theme.bg,
  backgroundImage: `radial-gradient(circle at 85% 15%, ${theme.surface} 0%, ${theme.bg} 60%)`,
  fontFamily: 'Outfit', color: theme.text,
}, [
  h('div', { display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'DM Mono', fontSize: 24, color: theme.muted }, [
    h('div', { width: 14, height: 14, borderRadius: 7, background: '#4ade80' }, ''),
    'Available for new opportunities',
  ]),
  h('div', { display: 'flex', flexDirection: 'column' }, [
    h('div', { fontFamily: 'DM Serif Display', fontSize: 104, lineHeight: 1.05 }, site.name),
    h('div', { fontFamily: 'DM Serif Display', fontStyle: 'italic', fontSize: 104, lineHeight: 1.05, color: theme.accent }, site.surname),
    h('div', { fontSize: 34, fontWeight: 300, marginTop: 28, color: theme.muted }, site.role),
  ]),
  h('div', { display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Mono', fontSize: 24, color: theme.muted }, [
    site.url,
    h('div', { color: theme.accent }, 'Portfolio'),
  ]),
]);

const svg = await satori(tree, {
  width: 1200, height: 630,
  fonts: [
    { name: 'DM Serif Display', data: font('@fontsource/dm-serif-display', 'dm-serif-display-latin-400-normal.woff'), style: 'normal' },
    { name: 'DM Serif Display', data: font('@fontsource/dm-serif-display', 'dm-serif-display-latin-400-italic.woff'), style: 'italic' },
    { name: 'Outfit', data: font('@fontsource/outfit', 'outfit-latin-300-normal.woff'), weight: 300 },
    { name: 'Outfit', data: font('@fontsource/outfit', 'outfit-latin-500-normal.woff'), weight: 500 },
    { name: 'DM Mono', data: font('@fontsource/dm-mono', 'dm-mono-latin-400-normal.woff'), weight: 400 },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
const outDir = join(root, 'src', 'assets');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'og-preview.png'), png);
console.log(`og-preview.png written (${(png.length / 1024).toFixed(0)} kB)`);
