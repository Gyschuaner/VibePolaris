import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname.replace(/^\/(?:[A-Za-z]:)/, (value) => value.slice(1));
const read = (path) => readFileSync(join(root, path), 'utf8');
const pages = ['index.html', 'terms.html', 'term-detail.html', 'guide.html', 'tools.html', 'about.html'];

test('all pages initialize a safe built-in palette before paint', () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /vp-palette/);
    assert.match(html, /moss:1,sprout:1,pomelo:1/);
    assert.match(html, /dataset\.theme/);
  }
});

test('homepage keeps the dynamic featured-domain pattern and one expanded state', () => {
  const html = read('index.html');
  assert.equal((html.match(/<article class="domain/g) || []).length, 5);
  assert.equal((html.match(/<article class="domain is-active"/g) || []).length, 1);
  assert.match(html, /<h1>VibePolaris<\/h1>/);
  assert.match(html, /查看全部领域/);
  assert.match(html, /data-logo-motion="intro"/);
});

test('theme tokens expose three palettes and preserve reduced-motion behavior', () => {
  const css = read('assets/style.css');
  for (const palette of ['moss', 'sprout', 'pomelo']) {
    assert.match(css, new RegExp(`data-palette="${palette}"`));
  }
  assert.match(css, /--brand-trail:/);
  assert.match(css, /--brand-star:/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /translate3d/);
  assert.doesNotMatch(css, /@keyframes vp-trail-arrive[\s\S]*clip-path/);
  assert.match(css, /meteor-trail-mask\.png/);
  assert.match(css, /polaris-star-mask\.png/);
});

test('theme API, domain interaction, and logo replay are present without runtime AI calls', () => {
  const js = read('assets/app.js');
  assert.match(js, /window\.VP_THEME/);
  assert.match(js, /setPalette/);
  assert.match(js, /vp:palettechange/);
  assert.match(js, /\.domain-grid/);
  assert.match(js, /is-arriving/);
  assert.doesNotMatch(js, /\bfetch\s*\(/);
  assert.doesNotMatch(js, /XMLHttpRequest/);
  assert.doesNotMatch(js, /openai|anthropic|generativelanguage/i);
});

test('theme API applies, persists, and safely falls back between built-in palettes', () => {
  const stored = new Map();
  const dispatched = [];
  const meta = { content: '', setAttribute(name, value) { this[name] = value; } };
  const rootElement = { dataset: { theme: 'light', palette: 'moss' }, dispatchEvent(event) { dispatched.push(event); } };
  const document = {
    documentElement: rootElement,
    querySelector(selector) { return selector === 'meta[name="theme-color"]' ? meta : null; },
    querySelectorAll() { return []; },
    getElementById() { return null; }
  };
  const window = { matchMedia() { return { matches: false }; } };
  const context = vm.createContext({
    document,
    window,
    localStorage: {
      getItem(key) { return stored.get(key) ?? null; },
      setItem(key, value) { stored.set(key, value); }
    },
    CustomEvent: class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    URLSearchParams,
    location: { search: '' },
    navigator: {},
    requestAnimationFrame(callback) { callback(); },
    setTimeout,
    clearTimeout
  });

  vm.runInContext(read('assets/app.js'), context);
  assert.equal(window.VP_THEME.getPalette(), 'moss');
  assert.equal(window.VP_THEME.setPalette('sprout'), 'sprout');
  assert.equal(rootElement.dataset.palette, 'sprout');
  assert.equal(stored.get('vp-palette'), 'sprout');
  assert.equal(meta.content, '#F8F7F1');
  assert.equal(window.VP_THEME.setPalette('unknown'), 'moss');
  assert.equal(rootElement.dataset.palette, 'moss');
  assert.equal(dispatched.at(-1).detail.palette, 'moss');
});

test('generated brand assets are stored in the project', () => {
  for (const asset of ['assets/meteor-trail-mask.png', 'assets/polaris-star-mask.png']) {
    const path = join(root, asset);
    assert.ok(existsSync(path));
    assert.ok(statSync(path).size > 10_000);
  }
});
