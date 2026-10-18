import type { NewsMotionSceneProps } from "@/lib/news-motion-types";

const c = {
  paper: "var(--motion-paper)", ink: "var(--motion-ink)", muted: "var(--motion-muted)",
  line: "var(--motion-line)", accent: "var(--motion-accent)", soft: "var(--motion-soft)",
};
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
function ease(progress: number, from = 0, to = 1) {
  const p = clamp((progress - from) / (to - from));
  return p * p * (3 - 2 * p);
}
function wrap(label: string, width: number, size: number) {
  const rows: string[] = [];
  let row = "", used = 0;
  for (const char of label) {
    const advance = /[\u0000-\u00ff]/.test(char) ? size * .56 : size;
    if (char === "\n" || (used + advance > width && row)) {
      rows.push(row); row = ""; used = 0;
    }
    if (char !== "\n") { row += char; used += advance; }
  }
  if (row) rows.push(row);
  return rows;
}
function Text({ label, x, y, width = 200, size = 16, anchor = "start", fill = c.ink, weight = 400, opacity = 1 }: {
  label: string; x: number; y: number; width?: number; size?: number;
  anchor?: "start" | "middle" | "end"; fill?: string; weight?: number; opacity?: number;
}) {
  return <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill} opacity={opacity}>
    {wrap(label, Math.max(32, width), size).map((row, i) => <tspan key={i} x={x} dy={i ? size * 1.3 : 0}>{row}</tspan>)}
  </text>;
}
function Chip({ x, y, width, label, opacity = 1 }: { x: number; y: number; width: number; label: string; opacity?: number }) {
  const height = Math.max(34, wrap(label, width - 12, 16).length * 21 + 13);
  return <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <path d={`M0 0H${width - 7}L${width} 7V${height}H0Z`} fill={c.paper} stroke={c.line} />
    <Text x={width / 2} y={22} width={width - 12} label={label} anchor="middle" />
  </g>;
}

function Press({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const narrow = w < 640, go = ease(p, .25, .85), lift = Math.sin(Math.PI * go);
  const pw = narrow ? w - 64 : Math.min(260, w * .29), ph = 82 + d.items.length * 26;
  const x = narrow ? 32 : mix(34, w - pw - 28, go);
  const y = narrow ? mix(86, h - ph - 44, go) : h * .5 - ph / 2 - 6 * lift;
  const rollX = narrow ? 20 : w * .51, rollY = narrow ? h * .52 : h * .5 - ph / 2 - 8;
  return <g>
    <Text x={28} y={27} label={d.source} width={narrow ? w - 56 : w * .35} fill={c.muted} />
    <Text x={narrow ? 28 : w - 28} y={narrow ? h - 15 : 27} anchor={narrow ? "start" : "end"} label={d.target} width={w * .42} fill={c.accent} />
    <rect x={narrow ? 18 : 20} y={narrow ? 61 : h * .5 - ph / 2 - 18} width={pw + 28} height={ph + 32} fill={c.soft} stroke={c.line} />
    <path d={narrow ? `M${w - 36} ${h - 32}H36V${h - ph - 60}` : `M${w - pw - 42} ${h * .5 + ph / 2 + 18}H${w - 14}V${h * .5 - ph / 2 - 18}`} fill="none" stroke={c.line} strokeWidth={2} />
    <g transform={`translate(${x} ${y}) rotate(${narrow ? 0 : -2 * lift} ${pw / 2} ${ph / 2})`}>
      <rect width={pw} height={ph} fill={c.paper} stroke={c.line} />
      <Text x={16} y={29} label={d.subject} width={pw - 32} size={18} weight={600} />
      {d.items.map((item, i) => <Text key={i} x={16} y={63 + i * 26} label={item} width={pw - 32} />)}
    </g>
    {narrow ? <g>
      <rect x={rollX} y={rollY - 14} width={w - 40} height={28} rx={8} fill={c.accent} />
      <path d={`M${rollX + 12 + (go * 18) % 12} ${rollY - 7}H${w - 48}`} stroke={c.paper} opacity={.3} />
      <Text x={w - 26} y={54} anchor="end" label={d.actor} width={w - 52} fill={c.accent} />
      <Text x={w / 2} y={rollY + 6} anchor="middle" label={d.action} width={w - 68} fill={c.paper} />
    </g> : <g>
      <rect x={rollX - 15} y={rollY} width={30} height={ph + 16} rx={8} fill={c.accent} />
      <path d={`M${rollX - 6 + (go * 18) % 12} ${rollY + 10}V${rollY + ph + 6}`} stroke={c.paper} opacity={.35} />
      <path d={`M${rollX} ${rollY + ph + 16}v16`} stroke={c.accent} />
      <g transform={`translate(${rollX} ${rollY + ph + 32}) rotate(${go * 720})`}><path d="M0 0H25" stroke={c.accent} strokeWidth={2} /><circle cx={25} r={5} fill={c.accent} /></g>
      <Text x={rollX} y={rollY - 40} anchor="middle" label={d.actor} width={160} fill={c.accent} />
      <Text x={rollX} y={rollY + ph + 78} anchor="middle" label={d.action} width={180} />
    </g>}
  </g>;
}

function Sieve({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const narrow = w < 640, cols = narrow ? 2 : d.items.length;
  const meshY = h * .48, meshX = 30, meshW = w - 60;
  const chipW = Math.min(164, (w - 72) / cols - 12);
  const rowStep = Math.max(45, ...d.items.map(item => wrap(item, chipW - 12, 16).length * 21 + 25));
  const shake = Math.sin(p * Math.PI * 10) * Math.sin(Math.PI * p) * 3;
  return <g>
    <Text x={28} y={28} label={d.source} width={w * .5} fill={c.muted} />
    <Text x={w - 28} y={28} anchor="end" label={d.actor} width={w * .43} fill={c.accent} />
    <Text x={w / 2} y={narrow ? 88 : 77} anchor="middle" label={d.subject} width={w - 64} size={18} weight={600} />
    <g transform={`translate(${shake} 0)`}>
      <path d={`M${meshX} ${meshY - 16}v34l26 26H${w - 56}l26 -26v-34`} fill="none" stroke={c.accent} strokeWidth={2} />
      {Array.from({ length: narrow ? 8 : 16 }, (_, i) => {
        const x = meshX + 18 + i * (meshW - 36) / (narrow ? 7 : 15);
        return <path key={i} d={`M${x - 9} ${meshY - 7}l18 14m-18 0l18 -14`} stroke={c.line} fill="none" />;
      })}
    </g>
    {d.items.map((item, i) => {
      const drop = ease(p, .14 + i * .1, .51 + i * .1);
      const col = i % cols, row = Math.floor(i / cols);
      const x = (w - cols * (chipW + 12) + 12) / 2 + col * (chipW + 12);
      const y = mix(116 + row * rowStep, meshY + 65 + row * rowStep, drop);
      return <Chip key={i} x={x} y={y} width={chipW} label={item} />;
    })}
    <Text x={w / 2} y={h - 59} anchor="middle" label={d.action} width={w - 60} />
    <path d={`M42 ${h - 43}v14H${w - 42}v-14`} fill="none" stroke={c.line} strokeWidth={2} />
    <Text x={w / 2} y={h - 8} anchor="middle" label={d.target} width={w - 64} fill={c.accent} />
  </g>;
}

function Stencil({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const narrow = w < 640, x = 30, y = 96, bw = w - 60, bh = h - 160;
  const sweep = ease(p, .2, .86), lift = 12 * (1 - ease(p, 0, .2));
  const rows = narrow ? d.items.length : 1, cols = narrow ? 1 : d.items.length;
  return <g>
    <Text x={28} y={26} label={d.actor} width={w - 56} fill={c.accent} />
    <Text x={28} y={57} label={d.source} width={w * .5} fill={c.muted} />
    <Text x={w - 28} y={57} anchor="end" label={d.action} width={w * .43} />
    <rect x={x} y={y} width={bw} height={bh} fill={c.paper} stroke={c.line} />
    <Text x={x + 18} y={y + 31} label={d.subject} width={bw - 36} size={18} weight={600} />
    <defs><clipPath id={`${id}-stencil-reveal`}><rect x={x} y={y + 48} width={narrow ? bw : bw * sweep} height={narrow ? (bh - 48) * sweep : bh - 48} /></clipPath></defs>
    <g clipPath={`url(#${id}-stencil-reveal)`}>
      {d.items.map((item, i) => <Text key={i} x={x + (i % cols + .5) * bw / cols} y={y + 85 + Math.floor(i / cols) * (bh - 73) / rows} anchor="middle" label={item} width={bw / cols - 25} fill={c.accent} />)}
    </g>
    <g transform={`translate(0 ${-lift})`}>
      <rect x={x - 5} y={y + 43} width={bw + 10} height={bh - 36} fill="none" stroke={c.muted} strokeWidth={2} />
      {d.items.map((_, i) => <rect key={i} x={x + i % cols * bw / cols + 8} y={y + 59 + Math.floor(i / cols) * (bh - 73) / rows} width={bw / cols - 16} height={narrow ? (bh - 73) / rows - 10 : bh - 90} fill="none" stroke={c.line} />)}
    </g>
    {narrow ? <g transform={`translate(0 ${sweep * (bh - 48)})`}><rect x={x - 10} y={y + 40} width={bw + 20} height={9} rx={2} fill={c.accent} /><path d={`M${w / 2} ${y + 40}v-21`} stroke={c.accent} strokeWidth={4} /></g>
      : <g transform={`translate(${sweep * bw} 0)`}><rect x={x - 5} y={y + 35} width={10} height={bh - 23} rx={2} fill={c.accent} /><path d={`M${x} ${y + 35}v-20`} stroke={c.accent} strokeWidth={4} /></g>}
    <Text x={w / 2} y={h - 17} anchor="middle" label={d.target} width={w - 64} fill={c.accent} />
  </g>;
}

function Gate({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const narrow = w < 640, open = ease(p, .12, .4), pass = ease(p, .4, .88);
  const middle = narrow ? h * .52 : w * .52;
  const paperW = Math.min(280, w * .32), titleH = wrap(d.subject, paperW - 30, 18).length * 24;
  const rowH = Math.max(26, ...d.items.map(item => wrap(item, paperW - 30, 16).length * 21 + 6));
  const paperH = 39 + titleH + d.items.length * rowH;
  return <g>
    <Text x={28} y={27} label={d.source} width={narrow ? w - 56 : w * .36} fill={c.muted} />
    <Text x={narrow ? 28 : w - 28} y={narrow ? h - 18 : 27} anchor={narrow ? "start" : "end"} label={d.target} width={w * .43} fill={c.accent} />
    {narrow ? <g>
      <Text x={28} y={65} label={d.subject} width={w - 56} size={18} weight={600} />
      <path d={`M26 ${middle - 18}h${w - 52}m-${w - 52} 36h${w - 52}`} stroke={c.line} strokeWidth={2} />
      <g transform={`translate(${open * w} 0)`}><rect x={26} y={middle - 14} width={w - 52} height={28} fill={c.accent} /><Text x={w / 2} y={middle + 6} label={d.action} anchor="middle" width={w - 64} fill={c.paper} /></g>
      <Text x={w / 2} y={middle - 46} anchor="middle" label={d.actor} width={w - 56} fill={c.accent} />
      {d.items.map((item, i) => <Chip key={i} x={26 + i % 2 * (w - 40) / 2} y={mix(105 + Math.floor(i / 2) * 67, middle + 67 + Math.floor(i / 2) * 67, ease(p, .4 + i * .035, .8 + i * .035))} width={(w - 64) / 2} label={item} />)}
    </g> : <g>
      <path d={`M${middle - 17} 80V${h - 45}m34 -${h - 125}V${h - 45}`} stroke={c.line} strokeWidth={2} />
      <defs><clipPath id={`${id}-gate-track`}><rect x={middle - 12} y={80} width={24} height={h - 125} /></clipPath></defs>
      <g clipPath={`url(#${id}-gate-track)`}><g transform={`translate(0 ${-open * (h - 115)})`}><rect x={middle - 12} y={80} width={24} height={h - 125} fill={c.accent} />{Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${middle - 9} ${99 + i * (h - 160) / 4}h18`} stroke={c.paper} opacity={.5} />)}</g></g>
      <Text x={middle} y={59} anchor="middle" label={d.actor} width={170} fill={c.accent} />
      <Text x={middle} y={h - 14} anchor="middle" label={d.action} width={200} />
      <g transform={`translate(${mix(28, w - paperW - 28, pass)} ${(h - paperH) / 2})`}>
        <path d={`M0 0H${paperW - 10}l10 10v${paperH - 10}H0Z`} fill={c.paper} stroke={c.line} />
        <Text x={15} y={29} label={d.subject} width={paperW - 30} size={18} weight={600} />
        {d.items.map((item, i) => <Text key={i} x={15} y={47 + titleH + i * rowH} label={item} width={paperW - 30} />)}
      </g>
    </g>}
  </g>;
}

function Seal({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const narrow = w < 640, px = 26, py = narrow ? 93 : 78, pw = narrow ? w - 52 : w * .7, ph = h - py - 53;
  const radius = narrow ? 40 : 49, sx = narrow ? w * .73 : w * .62, sy = h - 118;
  const contact = ease(p, .22, .5), retract = ease(p, .58, .83), handleY = mix(65, sy - 37, contact) - retract * 76;
  return <g>
    <Text x={28} y={27} label={d.actor} width={w - 56} fill={c.accent} />
    <Text x={px} y={py - 19} label={d.source} width={pw} fill={c.muted} />
    <rect x={px} y={py} width={pw} height={ph} fill={c.paper} stroke={c.line} />
    <Text x={px + 19} y={py + 34} label={d.subject} width={pw - 38} size={18} weight={600} />
    {d.items.map((item, i) => <g key={i}><Text x={px + 19} y={py + 77 + i * 29} label={item} width={pw - 38} /><path d={`M${px + 19} ${py + 85 + i * 29}H${px + pw - 20}`} stroke={c.line} /></g>)}
    <g opacity={ease(p, .48, .54)} transform={`rotate(-8 ${sx} ${sy})`}>
      <circle cx={sx} cy={sy} r={radius} fill={c.paper} fillOpacity={.7} stroke={c.accent} strokeWidth={2} />
      <circle cx={sx} cy={sy} r={radius - 6} fill="none" stroke={c.accent} />
      <Text x={sx} y={sy - 6} anchor="middle" label={d.action} width={radius * 1.55} fill={c.accent} weight={600} />
    </g>
    <g transform={`translate(${sx} ${handleY})`}>
      <path d="M-13 -24Q-22 -51 0 -54Q22 -51 13 -24L9 0H-9Z" fill={c.soft} stroke={c.muted} />
      <rect x={-radius} y={0} width={radius * 2} height={17} rx={3} fill={c.accent} />
      <path d={`M${-radius + 8} 21H${radius - 8}`} stroke={c.muted} strokeWidth={2} />
    </g>
    <Text x={28} y={h - 16} label={d.target} width={w - 56} fill={c.accent} />
  </g>;
}

function Rewind({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const narrow = w < 640, wind = ease(p, .14, .9), r = narrow ? 37 : 49;
  const ax = narrow ? w * .53 : 92, ay = narrow ? 117 : h * .52;
  const bx = narrow ? ax : w - 92, by = narrow ? h - 105 : ay;
  const start = narrow ? ay + 22 : ax + 22, length = narrow ? by - ay - 44 : bx - ax - 44;
  return <g>
    <Text x={w / 2} y={28} anchor="middle" label={d.subject} width={w - 56} size={18} weight={600} />
    <Text x={narrow ? w / 2 : 28} y={65} anchor={narrow ? "middle" : "start"} label={d.actor} width={narrow ? w - 56 : w * .46} fill={c.accent} />
    <Text x={narrow ? w / 2 : w - 28} y={narrow ? h - 17 : 65} anchor={narrow ? "middle" : "end"} label={d.action} width={narrow ? w - 56 : w * .46} />
    <defs><clipPath id={`${id}-rewind-strip`}><rect x={narrow ? ax - 53 : start} y={narrow ? start : ay - 34} width={narrow ? 106 : length} height={narrow ? length : 68} /></clipPath></defs>
    <g clipPath={`url(#${id}-rewind-strip)`}>
      <rect x={narrow ? ax - 53 : start} y={narrow ? start : ay - 34} width={narrow ? 106 : length} height={narrow ? length : 68} fill={c.soft} stroke={c.accent} />
      {d.items.map((item, i) => {
        const along = start + (i + .5) * length / d.items.length - wind * (length + 80);
        return <g key={i}>
          <Text x={narrow ? ax : along} y={narrow ? along : ay + 5} anchor="middle" label={item} width={narrow ? 92 : length / d.items.length - 12} />
          <path d={narrow ? `M${ax - 44} ${along - 12}h5m78 0h5` : `M${along - 8} ${ay - 25}h16m-16 50h16`} stroke={c.accent} strokeWidth={3} />
        </g>;
      })}
    </g>
    {[[ax, ay, 1], [bx, by, -1]].map(([x, y, direction], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${wind * 540 * direction})`}>
      <circle r={r} fill={c.paper} stroke={c.accent} strokeWidth={2} />
      <circle r={r * (i === 0 ? .32 + .5 * wind : .82 - .5 * wind)} fill={c.soft} stroke={c.line} />
      <circle r={9} fill={c.accent} />
      {[0, 120, 240].map(angle => <path key={angle} d={`M0 -14V-${r - 8}`} transform={`rotate(${angle})`} stroke={c.muted} />)}
    </g>)}
    <Text x={narrow ? 24 : ax} y={narrow ? ay + 5 : ay + r + 32} anchor={narrow ? "start" : "middle"} label={d.target} width={narrow ? w * .31 : 150} fill={c.accent} />
    <Text x={narrow ? 24 : bx} y={narrow ? by + 5 : by + r + 32} anchor={narrow ? "start" : "middle"} label={d.source} width={narrow ? w * .31 : 150} fill={c.muted} />
  </g>;
}

function Receipt({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const narrow = w < 640, printerW = narrow ? w - 48 : w * .6, x = (w - printerW) / 2;
  const paperW = Math.min(narrow ? w - 82 : 300, printerW - 34), paperX = (w - paperW) / 2;
  const slotY = 122, fullH = h - 172, feed = ease(p, .13, .88), paperH = 12 + (fullH - 12) * feed;
  const titleExtra = (wrap(d.subject, paperW - 34, 18).length - 1) * 24;
  return <g>
    <Text x={28} y={26} label={d.actor} width={w * .5} fill={c.accent} />
    <Text x={w - 28} y={26} anchor="end" label={d.action} width={w * .43} />
    <path d={`M${paperX} ${slotY}H${paperX + paperW}V${slotY + paperH}l-8 -5l-8 5l-8 -5H${paperX}Z`} fill={c.paper} stroke={c.line} />
    <defs><clipPath id={`${id}-receipt-feed`}><rect x={paperX} y={slotY} width={paperW} height={paperH - 6} /></clipPath></defs>
    <g clipPath={`url(#${id}-receipt-feed)`}>
      <Text x={paperX + 17} y={slotY + 36} label={d.subject} width={paperW - 34} size={18} weight={600} />
      <path d={`M${paperX + 17} ${slotY + 54 + titleExtra}H${paperX + paperW - 17}`} stroke={c.line} />
      {d.items.map((item, i) => <g key={i}><Text x={paperX + 17} y={slotY + 86 + titleExtra + i * 33} label={item} width={paperW - 34} /><path d={`M${paperX + 17} ${slotY + 97 + titleExtra + i * 33}H${paperX + paperW - 17}`} stroke={c.line} strokeDasharray="3 5" /></g>)}
    </g>
    <path d={`M${x} 63H${x + printerW}V134H${x}Z`} fill={c.soft} stroke={c.muted} />
    <Text x={w / 2} y={95} anchor="middle" label={d.source} width={printerW - 44} />
    <path d={`M${paperX - 7} ${slotY}H${paperX + paperW + 7}`} stroke={c.ink} strokeWidth={5} />
    <rect x={paperX + (paperW - 18) * (.5 - .5 * Math.cos(feed * Math.PI * (d.items.length + 1)))} y={slotY - 7} width={18} height={8} fill={c.accent} />
    <Text x={w / 2} y={h - 16} anchor="middle" label={d.target} width={w - 56} fill={c.accent} />
  </g>;
}

function Ledger({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const narrow = w < 640, x = 28, y = 91, bw = w - 56, bh = h - 131;
  const split = narrow ? x + 22 : w / 2, tx = narrow ? x + 22 : split + 22;
  const lineW = narrow ? bw - 44 : bw / 2 - 44, rowH = Math.min(56, (bh - 82) / d.items.length);
  return <g>
    <Text x={w / 2} y={27} anchor="middle" label={d.subject} width={w - 56} size={18} weight={600} />
    <Text x={28} y={59} label={d.actor} width={w * .47} fill={c.accent} />
    <Text x={w - 28} y={59} anchor="end" label={d.action} width={w * .43} />
    <path d={`M${x} ${y + 4}Q${w / 2} ${y - (narrow ? 4 : 14)} ${x + bw} ${y + 4}V${y + bh}Q${w / 2} ${y + bh - (narrow ? 0 : 12)} ${x} ${y + bh}Z`} fill={c.paper} stroke={c.line} />
    {!narrow && <path d={`M${split} ${y}V${y + bh - 10}`} stroke={c.muted} />}
    <Text x={x + 18} y={y + 32} label={d.source} width={narrow ? bw * .46 : bw / 2 - 36} fill={c.muted} />
    <Text x={narrow ? x + bw - 18 : tx} y={y + 32} anchor={narrow ? "end" : "start"} label={d.target} width={narrow ? bw * .46 : bw / 2 - 36} fill={c.accent} />
    {d.items.map((item, i) => {
      const write = ease(p, .1 + i * .16, .36 + i * .16), ry = y + 77 + i * rowH;
      return <g key={i}>
        {!narrow && <Text x={x + 22} y={ry} label={item} width={bw / 2 - 44} />}
        <path d={`M${tx} ${ry + 10}H${tx + lineW}`} stroke={c.line} />
        <defs><clipPath id={`${id}-ledger-${i}`}><rect x={tx} y={ry - 22} width={lineW * write} height={48} /></clipPath></defs>
        <g clipPath={`url(#${id}-ledger-${i})`}><Text x={tx} y={ry} label={item} width={lineW} /></g>
        {write > 0 && write < 1 && <g transform={`translate(${tx + lineW * write} ${ry + 5}) rotate(30)`}><path d="M0 0l-3 -7v-24h6v24Z" fill={c.accent} /><path d="M-3 -7H3" stroke={c.paper} /></g>}
      </g>;
    })}
    <path d={`M${x - 6} ${y + 12}V${y + bh + 6}H${x + bw - 6}`} fill="none" stroke={c.line} />
  </g>;
}

function Quota({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const narrow = w < 640, tankW = narrow ? w * .48 : w * .29, tankX = narrow ? 28 : w * .36;
  const tankY = 111, tankH = h - (narrow ? 190 : 168), fill = ease(p, .18, .88);
  const max = d.values ? Math.max(d.values.before, d.values.after, 1) : d.items.length;
  const before = d.values ? d.values.before / max : 0, after = d.values ? d.values.after / max : 1;
  const level = tankH * .84 * mix(before, after, fill), surfaceY = tankY + tankH - level;
  return <g>
    <Text x={28} y={27} label={d.source} width={w * .47} fill={c.muted} />
    <Text x={w - 28} y={27} anchor="end" label={d.actor} width={w * .44} fill={c.accent} />
    <Text x={narrow ? w / 2 : tankX + tankW / 2} y={81} anchor="middle" label={d.subject} width={narrow ? w - 56 : tankW * 1.6} size={18} weight={600} />
    <defs><clipPath id={`${id}-quota-liquid`}><rect x={tankX + 3} y={tankY + 3} width={tankW - 6} height={tankH - 6} rx={12} /></clipPath></defs>
    <g clipPath={`url(#${id}-quota-liquid)`}>
      <path d={`M${tankX} ${surfaceY}Q${tankX + tankW * .25} ${surfaceY - 7 * Math.sin(fill * Math.PI * 6)} ${tankX + tankW / 2} ${surfaceY}T${tankX + tankW} ${surfaceY}V${tankY + tankH}H${tankX}Z`} fill={c.soft} />
      <path d={`M${tankX} ${surfaceY}H${tankX + tankW}`} stroke={c.accent} strokeWidth={2} />
    </g>
    <rect x={tankX} y={tankY} width={tankW} height={tankH} rx={14} fill="none" stroke={c.accent} strokeWidth={2} />
    {d.items.map((item, i) => {
      const ry = tankY + tankH - (i + .5) * tankH * .84 / d.items.length;
      return <g key={i}><path d={`M${tankX + tankW - 9} ${ry}h20`} stroke={c.line} /><Text x={tankX + tankW + 19} y={ry + 5} label={item} width={narrow ? w - tankW - 65 : w * .28} fill={fill >= (i + .5) / d.items.length ? c.accent : c.muted} /></g>;
    })}
    <path d={`M${tankX + tankW * .75} ${tankY}V96h${narrow ? 60 : -80}`} fill="none" stroke={c.muted} strokeWidth={5} />
    <g transform={`translate(${tankX + tankW * .75} 96) rotate(${fill * 95})`}><path d="M-15 0H15M0 -6V6" stroke={c.accent} strokeWidth={3} /></g>
    <Text x={narrow ? w - 24 : tankX - 20} y={narrow ? h - 51 : tankY + 24} anchor="end" label={d.action} width={narrow ? w - 48 : w * .28} />
    {d.values && <Text x={tankX + tankW / 2} y={tankY + tankH - 16} anchor="middle" label={`${mix(d.values.before, d.values.after, fill).toLocaleString("zh-CN", { maximumFractionDigits: 1 })}${d.values.unit}`} width={tankW - 20} fill={c.accent} weight={600} />}
    <Text x={tankX + tankW / 2} y={h - 16} anchor="middle" label={d.target} width={narrow ? w - 56 : w * .5} fill={c.accent} />
  </g>;
}

function Hourglass({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const narrow = w < 640, x = narrow ? w * .33 : w * .48, top = narrow ? 136 : 90, bottom = h - 62, neck = (top + bottom) / 2;
  const half = narrow ? w * .23 : Math.min(116, w * .17), sand = ease(p, .08, .92);
  const itemWidth = w - (x + half + (narrow ? 15 : 28)) - 20;
  const itemStep = Math.max(26, ...d.items.map(item => wrap(item, itemWidth, 16).length * 21 + 5));
  const glass = `M${x - half} ${top}Q${x - half} ${neck - 50} ${x - 8} ${neck}Q${x - half} ${neck + 52} ${x - half} ${bottom}H${x + half}Q${x + half} ${neck + 52} ${x + 8} ${neck}Q${x + half} ${neck - 50} ${x + half} ${top}Z`;
  return <g>
    <Text x={w / 2} y={27} anchor="middle" label={d.subject} width={w - 56} size={18} weight={600} />
    <Text x={28} y={61} label={d.source} width={w * .43} fill={c.muted} />
    <Text x={w - 28} y={61} anchor="end" label={d.actor} width={w * .43} fill={c.accent} />
    <defs><clipPath id={`${id}-hourglass`}><path d={glass} /></clipPath></defs>
    <g clipPath={`url(#${id}-hourglass)`}>
      <path d={`M${x - half} ${mix(top + 27, neck, sand)}H${x + half}L${x} ${neck}Z`} fill={c.soft} stroke={c.accent} />
      <path d={`M${x - half} ${bottom}H${x + half}L${x} ${bottom - (bottom - neck - 24) * sand}Z`} fill={c.soft} stroke={c.accent} />
      <path d={`M${x} ${neck}V${bottom - (bottom - neck - 24) * sand}`} stroke={c.accent} strokeWidth={sand > 0 && sand < 1 ? 3 : 0} strokeDasharray="3 6" strokeDashoffset={-p * 36} />
    </g>
    <path d={glass} fill="none" stroke={c.muted} strokeWidth={2} />
    <path d={`M${x - half - 9} ${top - 5}H${x + half + 9}M${x - half - 9} ${bottom + 5}H${x + half + 9}`} stroke={c.accent} strokeWidth={5} />
    {d.items.map((item, i) => {
      const fall = ease(p, .1 + i * .12, .49 + i * .12);
      const labelFall = ease(p, .1, .85);
      const labelX = narrow ? x + half + 15 : x + half + 28;
      return <g key={i}>
        <Text x={labelX} y={mix(top + 28 + i * itemStep, bottom - 24 - (d.items.length - i - 1) * itemStep, labelFall)} label={item} width={itemWidth} fill={labelFall > .6 ? c.accent : c.ink} />
        <circle cx={x} cy={mix(top + 35, bottom - 12, fall)} r={3} fill={c.accent} />
      </g>;
    })}
    <Text x={narrow ? w / 2 : 28} y={narrow ? 109 : neck + 5} anchor={narrow ? "middle" : "start"} label={d.action} width={narrow ? w - 56 : w * .27} />
    <Text x={x} y={h - 17} anchor="middle" label={d.target} width={narrow ? w * .58 : w * .5} fill={c.accent} />
  </g>;
}

function Fold({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const narrow = w < 640, first = ease(p, .15, .5), second = ease(p, .48, .82);
  const x = 28, y = 94, pw = w - 56, ph = h - 151;
  const left = narrow ? x : mix(x, x + pw / 3, first), right = narrow ? x + pw : mix(x + pw, x + pw * 2 / 3, second);
  const top = narrow ? mix(y, y + ph / 3, first) : y, bottom = narrow ? mix(y + ph, y + ph * 2 / 3, second) : y + ph;
  return <g>
    <Text x={28} y={27} label={d.actor} width={w * .47} fill={c.accent} />
    <Text x={w - 28} y={27} anchor="end" label={d.action} width={w * .44} />
    <Text x={28} y={65} label={d.source} width={w - 56} fill={c.muted} />
    <path d={`M${left} ${top}H${right}V${bottom}H${left}Z`} fill={c.paper} stroke={c.line} />
    {narrow ? <g>
      <path d={`M${x} ${y + ph / 3}H${x + pw}M${x} ${y + ph * 2 / 3}H${x + pw}`} stroke={c.line} strokeDasharray="5 5" />
      <path d={`M${x} ${top}L${x + pw / 2} ${y + ph / 3}L${x + pw} ${top}`} fill={c.soft} fillOpacity={first * .65} stroke={c.line} />
      <path d={`M${x} ${bottom}L${x + pw / 2} ${y + ph * 2 / 3}L${x + pw} ${bottom}`} fill={c.soft} fillOpacity={second * .65} stroke={c.line} />
      {d.items.map((item, i) => <Text key={i} x={x + 18} y={i % 2 === 0 ? y + 31 + Math.floor(i / 2) * 27 : y + ph * 2 / 3 + 29 + Math.floor(i / 2) * 27} label={item} width={pw - 36} opacity={1 - (i % 2 === 0 ? first : second)} />)}
    </g> : <g>
      <path d={`M${x + pw / 3} ${y}V${y + ph}M${x + pw * 2 / 3} ${y}V${y + ph}`} stroke={c.line} strokeDasharray="5 5" />
      <path d={`M${left} ${y}L${x + pw / 3} ${y + ph / 2}L${left} ${y + ph}`} fill={c.soft} fillOpacity={first * .65} stroke={c.line} />
      <path d={`M${right} ${y}L${x + pw * 2 / 3} ${y + ph / 2}L${right} ${y + ph}`} fill={c.soft} fillOpacity={second * .65} stroke={c.line} />
      {d.items.map((item, i) => <Text key={i} x={i % 2 === 0 ? x + 17 : x + pw * 2 / 3 + 17} y={y + 44 + Math.floor(i / 2) * 40} label={item} width={pw / 3 - 34} opacity={1 - (i % 2 === 0 ? first : second)} />)}
    </g>}
    <Text x={w / 2} y={narrow ? y + ph / 2 - 3 : y + ph / 2 - 8} anchor="middle" label={d.subject} width={narrow ? pw - 32 : pw / 3 - 32} size={18} weight={600} />
    <path d={narrow ? `M${x + pw - 23} ${y + ph / 3 - 5}v17h12v-17` : `M${x + pw / 3 - 5} ${y + 20}h17v12h-17`} fill={c.accent} opacity={ease(p, .8, 1)} />
    <Text x={w / 2} y={h - 17} anchor="middle" label={d.target} width={w - 56} fill={c.accent} />
  </g>;
}

function Licence({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const narrow = w < 640, insert = ease(p, .2, .78), turn = ease(p, .72, .91);
  const lockX = narrow ? w / 2 : w * .72, lockY = narrow ? h * .69 : h * .55;
  const keyX = narrow ? lockX : mix(w * .14, lockX - 146, insert);
  const keyY = narrow ? mix(124, lockY - 146, insert) : lockY;
  return <g>
    <Text x={28} y={27} label={d.source} width={w * .46} fill={c.muted} />
    <Text x={w - 28} y={27} anchor="end" label={d.actor} width={w * .46} fill={c.accent} />
    <path d={narrow ? `M35 ${lockY - 44}H${w - 35}M35 ${lockY + 44}H${w - 35}` : `M${lockX - 44} 77V${h - 48}M${lockX + 44} 77V${h - 48}`} stroke={c.line} strokeWidth={2} />
    <path d={`M${lockX - 43} ${lockY - 43}H${lockX + 43}V${lockY + 43}H${lockX - 43}Z`} fill={c.soft} stroke={c.accent} strokeWidth={2} />
    <path d={`M${lockX - 21} ${lockY - 43}v-16a21 21 0 0 1 42 0v16`} fill="none" stroke={c.accent} strokeWidth={5} />
    <circle cx={lockX} cy={lockY} r={12} fill={c.paper} stroke={c.accent} /><path d={`M${lockX} ${lockY - 6}v12`} stroke={c.accent} strokeWidth={3} />
    <g transform={`translate(${keyX} ${keyY}) rotate(${(narrow ? 90 : 0) + turn * 13})`}>
      <circle r={26} fill={c.paper} stroke={c.accent} strokeWidth={5} /><circle r={12} fill="none" stroke={c.line} />
      <path d="M26 -5H145V5H26" fill={c.accent} />
      {d.items.map((_, i) => <path key={i} d={`M${67 + i * 20} 4v${i % 2 ? 12 : 19}h9V4`} fill={c.accent} />)}
    </g>
    <Text x={narrow ? w / 2 : w * .25} y={narrow ? 75 : lockY - 76} anchor="middle" label={d.subject} width={narrow ? w - 56 : w * .4} size={18} weight={600} />
    <Text x={narrow ? w / 2 : lockX} y={narrow ? h - 64 : lockY + 89} anchor="middle" label={d.action} width={narrow ? w - 56 : w * .38} />
    {d.items.map((item, i) => <Text key={i} x={narrow ? 28 : w * .13 + i % 2 * w * .23} y={narrow ? 170 + i * 44 : h - 73 + Math.floor(i / 2) * 30} label={item} width={narrow ? w * .38 : w * .23 - 12} fill={insert > .6 ? c.accent : c.muted} />)}
    <Text x={narrow ? w / 2 : lockX} y={h - 15} anchor="middle" label={d.target} width={narrow ? w - 56 : w * .38} fill={c.accent} />
  </g>;
}

export function MaterialScene(props: NewsMotionSceneProps) {
  switch (props.design.scene) {
    case "press": return <Press {...props} />;
    case "sieve": return <Sieve {...props} />;
    case "stencil": return <Stencil {...props} />;
    case "gate": return <Gate {...props} />;
    case "seal": return <Seal {...props} />;
    case "rewind": return <Rewind {...props} />;
    case "receipt": return <Receipt {...props} />;
    case "ledger": return <Ledger {...props} />;
    case "quota": return <Quota {...props} />;
    case "hourglass": return <Hourglass {...props} />;
    case "fold": return <Fold {...props} />;
    case "licence": return <Licence {...props} />;
    default: return null;
  }
}
