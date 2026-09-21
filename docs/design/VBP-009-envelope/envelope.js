// Design prototype: one merged water surface, outlined only after the union.
const presets = {
  water: { radius: 23, life: 840, fade: 780, spread: 17, bulge: .42, opacity: .76, label: 'A · 水面包络', text: '边缘柔和地向外展开，转弯相融，松开后整片水痕舒展消散。' },
  fine: { radius: 10, life: 580, fade: 540, spread: 10, bulge: .15, opacity: .65, label: 'B · 轻细水线', text: '更贴近光标，轮廓细而短，阅读时存在感更轻。' },
  silk: { radius: 18, life: 1250, fade: 950, spread: 7, bulge: .08, opacity: .76, label: 'C · 柔软拖尾', text: '水痕留得更长，尾端缓缓收细，转弯带一点柔软的牵引感。' }
};
const mode = document.body.dataset.mode;
const preset = presets[mode];
const stage = document.querySelector('.stage');
const svg = document.querySelector('.stage svg');
const shape = document.querySelector('#water-shape');
const pointer = document.querySelector('#demo-pointer');
const replay = document.querySelector('#replay');
const freeze = document.querySelector('#freeze');
const hint = document.querySelector('.hint');
document.querySelector(`nav [data-mode="${mode}"]`).setAttribute('aria-current', 'page');
document.querySelector('.caption').innerHTML = `<strong>${preset.label}</strong>${preset.text}`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let points = [], frame = 0, down = false, released = null, demoStart = null, frozenAt = null;

const smoothstep = t => t * t * (3 - 2 * t);
function reset() {
  cancelAnimationFrame(frame);
  frame = 0; points = []; released = null; demoStart = null; down = false; frozenAt = null;
  freeze.setAttribute('aria-pressed', 'false'); freeze.textContent = '定格';
  pointer.setAttribute('opacity', '0'); shape.setAttribute('d', '');
}
function queue() { if (!frame && frozenAt === null) frame = requestAnimationFrame(tick); }
function append(x, y, t) {
  const last = points.at(-1);
  if (!last || Math.hypot(x - last.x, y - last.y) > 2) points.push({ x, y, t });
  queue();
}
function trail(now) {
  const cutoff = now - preset.life;
  if (points.length > 1 && points.at(-1).t < cutoff) points = [points.at(-1)];
  while (points.length > 2 && points[1].t < cutoff) points.shift();
  if (points.length > 1 && points[0].t < cutoff) {
    const a = points[0], b = points[1];
    const f = Math.min(1, (cutoff - a.t) / Math.max(1, b.t - a.t));
    points[0] = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, t: cutoff };
  }
}
function smoothPoints(input) {
  if (input.length < 2) return input;
  const output = [];
  for (let i = 0; i < input.length - 1; i++) {
    const a = input[Math.max(0, i - 1)], b = input[i], c = input[i + 1], d = input[Math.min(input.length - 1, i + 2)];
    const steps = Math.max(1, Math.ceil(Math.hypot(c.x - b.x, c.y - b.y) / 4));
    for (let j = 0; j < steps; j++) {
      const t = j / steps;
      const value = key => .5 * (2 * b[key] + (-a[key] + c[key]) * t + (2 * a[key] - 5 * b[key] + 4 * c[key] - d[key]) * t * t + (-a[key] + 3 * b[key] - 3 * c[key] + d[key]) * t * t * t);
      output.push({ x: value('x'), y: value('y') });
    }
  }
  output.push(input.at(-1));
  return output;
}
function draw(input, progress = 0) {
  const samples = smoothPoints(input);
  if (!samples.length) return;
  const coords = [];
  const format = n => n.toFixed(2);
  // Overlapping filled discs are a sampling device, never separately outlined.
  // The SVG filter merges their alpha before extracting the outside boundary.
  samples.forEach((point, i) => {
    const u = samples.length > 1 ? i / (samples.length - 1) : 1;
    const taper = .12 + .88 * smoothstep(Math.min(1, u * 3));
    const r = (preset.radius * taper * (1 + preset.bulge * Math.sin(Math.PI * u)) + preset.spread * smoothstep(progress)) * (samples.length === 1 ? .8 : 1);
    coords.push(`M${format(point.x - r)},${format(point.y)}a${format(r)},${format(r)} 0 1 0 ${format(2 * r)},0a${format(r)},${format(r)} 0 1 0 ${format(-2 * r)},0Z`);
  });
  shape.setAttribute('d', coords.join(''));
  shape.setAttribute('opacity', String(preset.opacity * (1 - smoothstep(progress))));
}
function demoPoint(u) {
  return { x: stage.clientWidth * (.18 + .64 * u), y: stage.clientHeight * (.53 + .16 * Math.sin(u * Math.PI * 2.15 - .8)) };
}
function tick(now) {
  frame = 0;
  if (demoStart !== null) {
    const u = Math.min(1, (now - demoStart) / 2400);
    const p = demoPoint(u);
    append(p.x, p.y, now);
    pointer.setAttribute('transform', `translate(${p.x},${p.y})`);
    pointer.setAttribute('opacity', '.7');
    if (u === 1) { demoStart = null; down = false; released = now; pointer.setAttribute('opacity', '0'); }
  }
  if (released === null) trail(now);
  const progress = released === null ? 0 : Math.min(1, (now - released) / preset.fade);
  draw(points, progress);
  if (progress === 1) { shape.setAttribute('d', ''); points = []; hint.textContent = '按住鼠标拖动，也可以试着画个弯'; }
  else if (demoStart !== null || released !== null || (down && points.length > 1)) queue();
}
function position(event) {
  const rect = stage.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}
stage.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  reset(); down = true; stage.setPointerCapture(event.pointerId);
  hint.textContent = '松开后，水痕会自然散开';
  const p = position(event); append(p.x, p.y, performance.now());
});
stage.addEventListener('pointermove', event => {
  if (!down || demoStart !== null || frozenAt !== null) return;
  const p = position(event); append(p.x, p.y, performance.now());
});
function release() {
  if (!down) return;
  down = false; released = performance.now();
  if (reduced.matches) { reset(); return; }
  queue();
}
stage.addEventListener('pointerup', release);
stage.addEventListener('pointercancel', release);
window.addEventListener('blur', () => { if (frozenAt === null) reset(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && frozenAt === null) reset(); });
replay.addEventListener('click', () => {
  reset();
  if (reduced.matches) { showStill(); return; }
  demoStart = performance.now(); down = true; hint.textContent = '同一段轨迹，比较轮廓与消散'; queue();
});
freeze.addEventListener('click', () => {
  if (frozenAt === null) {
    frozenAt = performance.now(); cancelAnimationFrame(frame); frame = 0;
    freeze.setAttribute('aria-pressed', 'true'); freeze.textContent = '继续';
  } else {
    const delta = performance.now() - frozenAt;
    points.forEach(p => { p.t += delta; });
    if (released !== null) released += delta;
    if (demoStart !== null) demoStart += delta;
    frozenAt = null; freeze.setAttribute('aria-pressed', 'false'); freeze.textContent = '定格'; queue();
  }
});
function showStill() {
  reset();
  const now = performance.now();
  const sample = Array.from({ length: 70 }, (_, i) => ({ ...demoPoint(i / 69), t: now - (1 - i / 69) * preset.life }));
  draw(sample);
  hint.textContent = '按住鼠标拖动，也可以试着画个弯';
}
new ResizeObserver(() => { svg.setAttribute('viewBox', `0 0 ${stage.clientWidth} ${stage.clientHeight}`); if (!down && !points.length) showStill(); }).observe(stage);
showStill();
