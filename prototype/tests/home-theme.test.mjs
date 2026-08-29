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

test('homepage removes redundant copy and keeps arrow-only accessible domain entries', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /Vibe 指北 · 技术术语与选型指南/);
  assert.doesNotMatch(html, /从术语出发，把技术世界看清一点/);
  assert.doesNotMatch(html, /首页精选领域会持续调整/);
  assert.doesNotMatch(html, /精选 0[1-5]/);
  assert.equal((html.match(/class="domain-enter"/g) || []).length, 5);
  assert.equal((html.match(/class="domain-enter"[^>]+aria-label="进入[^\"]+章节"><span aria-hidden="true">→<\/span><\/a>/g) || []).length, 5);
  assert.doesNotMatch(html, /class="domain-enter"[^>]*>进入/);
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
  assert.match(css, /steps\(31, end\)/);
  assert.match(css, /12\.5%[\s\S]*87\.5%/);
  assert.match(css, /0%[^}]*scale\(\.22\); opacity: 0;/);
  assert.match(css, /12\.5%[^}]*opacity: \.08;/);
  assert.match(css, /87\.5%[^}]*opacity: \.985;/);
  assert.match(css, /\.brand-mark--hero \.brand-star \{ width: 48px; height: 48px; right: -2px;/);
  assert.match(css, /meteor-trail-frames\.png/);
  assert.match(css, /polaris-star-mask\.png/);
});

test('theme API, domain interaction, and logo replay are present without runtime AI calls', () => {
  const js = read('assets/app.js');
  assert.match(js, /window\.VP_THEME/);
  assert.match(js, /setPalette/);
  assert.match(js, /vp:palettechange/);
  assert.match(js, /\.domain-grid/);
  assert.match(js, /is-arriving/);
  assert.match(js, /is-glinting/);
  assert.doesNotMatch(js, /\bfetch\s*\(/);
  assert.doesNotMatch(js, /XMLHttpRequest/);
  assert.doesNotMatch(js, /openai|anthropic|generativelanguage/i);
});

test('domain motion stays restrained and respects reduced-motion', () => {
  const js = read('assets/app.js');
  const css = read('assets/style.css');
  assert.match(js, /is-entering/);
  assert.match(js, /is-leaving/);
  assert.match(js, /setTimeout\([\s\S]*150/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.match(css, /flex-grow 420ms/);
  assert.match(css, /opacity 240ms[\s\S]*80ms/);
  assert.match(css, /transition-duration: 140ms/);
  assert.match(css, /translateY\(-6px\)/);
  assert.match(css, /translateY\(8px\)/);
  assert.match(css, /\.domain-enter:hover span,[\s\S]*translateX\(5px\)/);
});

test('terms and detail pages remove the stage system completely', () => {
  const terms = read('terms.html');
  const detail = read('term-detail.html');
  const js = read('assets/app.js');
  const css = read('assets/style.css');
  for (const source of [terms, detail, js, css]) {
    assert.doesNotMatch(source, /stageSel|dStage|class="stage"|\.roadmap|data-stop=/);
  }
  assert.doesNotMatch(js, /stage:\s*['"]/);
  assert.doesNotMatch(js, /state\.stage|t\.stage/);
  assert.doesNotMatch(terms, /全部阶段|起步|进阶|熟练/);
  assert.doesNotMatch(detail, /起步|进阶|熟练/);
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

test('generated brand assets and motion frames are stored in the project', () => {
  for (const asset of ['assets/meteor-trail-mask.png', 'assets/polaris-star-mask.png', 'assets/meteor-trail-frames.png']) {
    const path = join(root, asset);
    assert.ok(existsSync(path));
    assert.ok(statSync(path).size > 10_000);
  }
});
