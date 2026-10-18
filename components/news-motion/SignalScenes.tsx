import type { NewsMotionSceneProps } from "@/lib/news-motion-types";

const C = {
  paper: "var(--motion-paper)", ink: "var(--motion-ink)", muted: "var(--motion-muted)",
  line: "var(--motion-line)", accent: "var(--motion-accent)", soft: "var(--motion-soft)",
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const phase = (progress: number, start: number, end: number) => {
  const value = clamp((progress - start) / (end - start));
  return value * value * (3 - 2 * value);
};
type Point = [number, number];

function along(points: Point[], amount: number): Point {
  const position = clamp(amount) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(position));
  return [lerp(points[index][0], points[index + 1][0], position - index), lerp(points[index][1], points[index + 1][1], position - index)];
}

function path(points: Point[]) {
  return points.map(([x, y], index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
}

function textLines(value: string, width: number) {
  const lines: string[] = [];
  let line = "";
  let used = 0;
  for (const character of value) {
    const size = /[\x00-\x7F]/.test(character) ? 8 : 16;
    if (character === "\n" || (line && used + size > width)) {
      lines.push(line);
      line = "";
      used = 0;
      if (character === "\n") continue;
    }
    line += character;
    used += size;
  }
  if (line) lines.push(line);
  return lines;
}

function Text({ x, y, value, width = 160, anchor = "start", color = C.ink, strong = false }: {
  x: number; y: number; value: string; width?: number; anchor?: "start" | "middle" | "end"; color?: string; strong?: boolean;
}) {
  return <text x={x} y={y} fill={color} fontSize={16} fontWeight={strong ? 600 : 400} textAnchor={anchor}>
    {textLines(value, width).map((line, index) => <tspan key={index} x={x} dy={index ? 20 : 0}>{line}</tspan>)}
  </text>;
}

function objects(props: NewsMotionSceneProps) {
  return props.design.items.length ? props.design.items.slice(0, 4) : [props.design.subject];
}

function Lens({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const compact = w < 640;
  const items = d.items.length ? d.items.slice(0, 4) : [d.subject];
  const paper = { x: compact ? 20 : 36, y: 50, w: compact ? w - 40 : w * 0.49, h: compact ? h * 0.46 : h - 95 };
  const target = { x: compact ? 36 : w * 0.65, y: compact ? h * 0.62 : 98 };
  const step = compact ? 32 : Math.min(44, (paper.h - 92) / Math.max(1, items.length - 1));
  const scanY = paper.y + 48 + phase(p, 0.08, 0.9) * (items.length * step + 8);
  return <g>
    <defs><clipPath id={`${id}-lens-paper`}><rect x={paper.x + 8} y={paper.y + 2} width={paper.w - 16} height={paper.h - 4} /></clipPath></defs>
    <Text x={paper.x} y={30} value={d.source} width={paper.w} strong />
    <rect x={paper.x} y={paper.y} width={paper.w} height={paper.h} rx={2} fill={C.paper} stroke={C.line} />
    <Text x={paper.x + 18} y={paper.y + 28} value={d.subject} width={paper.w - 36} strong />
    <path d={`M ${paper.x + 18} ${paper.y + 40} H ${paper.x + paper.w - 18}`} stroke={C.line} />
    <g clipPath={`url(#${id}-lens-paper)`}>
      <rect x={paper.x + 10} y={scanY - 15} width={paper.w - 20} height={30} fill={C.soft} stroke={C.accent} />
      {items.map((_, i) => <path key={i} d={`M ${paper.x + 20} ${paper.y + 68 + i * step} h ${paper.w * 0.62}`} stroke={C.line} strokeDasharray="3 5" opacity={phase(p, 0.15 + i * 0.16, 0.32 + i * 0.16)} />)}
    </g>
    <path d={`M ${paper.x + paper.w - 5} ${Math.min(paper.y + paper.h - 6, scanY) - 8} v 16`} stroke={C.accent} strokeWidth={4} />
    <Text x={target.x} y={target.y - 22} value={d.target} width={compact ? w - 70 : w * 0.3} strong color={C.accent} />
    {items.map((item, i) => {
      const amount = phase(p, 0.14 + i * 0.16, 0.34 + i * 0.16);
      const x = lerp(paper.x + 20, target.x, amount);
      const y = lerp(paper.y + 67 + i * step, target.y + i * (compact ? 27 : 42), amount) - Math.sin(Math.PI * amount) * 12;
      return <g key={i}><Text x={x} y={y} value={item} width={compact ? w - 80 : w * 0.29} color={amount === 1 ? C.accent : C.ink} /></g>;
    })}
    <Text x={paper.x + paper.w - 4} y={compact ? h - 10 : h - 13} value={d.actor} width={paper.w} anchor="end" color={C.muted} />
  </g>;
}

function Router(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const inlet: Point = compact ? [w / 2, 53] : [48, h * 0.49];
  const hub: Point = compact ? [w / 2, 128] : [w * 0.43, h * 0.49];
  const ends: Point[] = items.map((_, i) => compact
    ? [items.length === 1 ? w / 2 : w * (i % 2 ? 0.73 : 0.27), h * 0.6 + Math.floor(i / 2) * 82]
    : [w * 0.78, 65 + i * (h - 125) / Math.max(1, items.length - 1)]);
  const selected = Math.max(0, items.indexOf(d.target));
  const switchEnd = along([hub, ends[selected]], phase(p, 0.1, 0.3));
  const routed = phase(p, 0.12, 0.89);
  const packet = along([inlet, hub, ends[selected]], routed);
  return <g>
    <Text x={compact ? w / 2 : 36} y={compact ? 27 : h * 0.49 - 54} value={d.source} width={compact ? w - 48 : w * 0.28} anchor={compact ? "middle" : "start"} strong />
    <path d={path([inlet, hub])} stroke={C.line} strokeWidth={3} fill="none" />
    {ends.map((end, i) => <path key={i} d={compact ? `M ${hub[0]} ${hub[1]} Q ${end[0]} ${hub[1] + 40} ${end[0]} ${end[1] - 20}` : `M ${hub[0]} ${hub[1]} Q ${hub[0] + 74} ${end[1]} ${end[0] - 16} ${end[1]}`} stroke={C.line} fill="none" />)}
    <path d={path([hub, [lerp(hub[0], switchEnd[0], 0.3), lerp(hub[1], switchEnd[1], 0.3)]])} stroke={C.accent} strokeWidth={5} />
    <circle cx={hub[0]} cy={hub[1]} r={13} fill={C.paper} stroke={C.accent} strokeWidth={2} />
    <path d={`M ${hub[0] - 4} ${hub[1]} h 8`} stroke={C.accent} strokeWidth={2} />
    <Text x={hub[0]} y={compact ? 166 : hub[1] - 39} value={d.subject} width={compact ? w - 60 : w * 0.35} anchor="middle" strong />
    {items.map((item, i) => <Text key={i} x={ends[i][0]} y={ends[i][1] + (compact ? 7 : 5)} value={item} width={compact ? w * 0.39 : w * 0.22} anchor={compact ? "middle" : "start"} color={i === selected && routed > 0.5 ? C.accent : C.muted} />)}
    <rect x={packet[0] - 7} y={packet[1] - 5} width={14} height={10} rx={2} fill={C.accent} />
    <Text x={compact ? w / 2 : w - 30} y={h - 18} value={d.target} width={w * 0.55} anchor={compact ? "middle" : "end"} strong />
    <Text x={compact ? 22 : hub[0]} y={compact ? h * 0.49 : hub[1] + 52} value={d.actor} width={compact ? w - 44 : w * 0.3} anchor={compact ? "start" : "middle"} color={C.muted} />
  </g>;
}

function Loom(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const cloth = { x: compact ? 34 : w * 0.49, y: compact ? h * 0.51 : 68, w: compact ? w - 68 : w * 0.44, h: compact ? h * 0.29 : h - 125 };
  const reveal = phase(p, 0.2, 0.91);
  const shuttleY = cloth.y + cloth.h * reveal;
  return <g>
    <Text x={compact ? w / 2 : 32} y={28} value={d.source} width={compact ? w - 40 : w * 0.42} anchor={compact ? "middle" : "start"} strong />
    {items.map((item, i) => {
      const y = compact ? 66 + i * 31 : 84 + i * (h - 156) / Math.max(1, items.length - 1);
      const x = compact ? 30 : 38;
      const endX = cloth.x + (i + 1) * cloth.w / (items.length + 1);
      return <g key={i}>
        <Text x={x} y={y} value={item} width={compact ? w - 65 : w * 0.3} />
        <path d={`M ${compact ? w - 28 : w * 0.35} ${y - 5} Q ${compact ? w - 15 : cloth.x - 40} ${cloth.y - 15} ${endX} ${cloth.y + cloth.h}`} fill="none" stroke={i % 2 ? C.muted : C.accent} strokeWidth={2} />
      </g>;
    })}
    <rect x={cloth.x - 11} y={cloth.y - 8} width={cloth.w + 22} height={cloth.h + 16} fill="none" stroke={C.line} />
    <Text x={cloth.x + cloth.w / 2} y={cloth.y - 20} value={d.subject} width={cloth.w} anchor="middle" strong />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${cloth.x + i * cloth.w / 8} ${cloth.y} V ${cloth.y + cloth.h}`} stroke={C.line} />)}
    {Array.from({ length: 12 }, (_, row) => <g key={row} opacity={phase(reveal, row / 13, (row + 1) / 13)}>
      <path d={`M ${cloth.x} ${cloth.y + row * cloth.h / 11} h ${cloth.w}`} stroke={C.accent} strokeWidth={4} />
      {Array.from({ length: 8 }, (_, column) => <path key={column} d={`M ${cloth.x + (column + 0.5) * cloth.w / 8} ${cloth.y + row * cloth.h / 11 - 5} v 10`} stroke={(row + column) % 2 ? C.paper : C.accent} strokeWidth={3} />)}
    </g>)}
    <g transform={`translate(${cloth.x + cloth.w * (0.5 + Math.sin(reveal * Math.PI * 8) * 0.47)} ${shuttleY})`} opacity={1 - phase(p, 0.9, 1)}>
      <path d="M -19 0 Q 0 -12 19 0 Q 0 12 -19 0 Z" fill={C.paper} stroke={C.accent} strokeWidth={2} /><path d="M -5 0 H 5" stroke={C.accent} />
    </g>
    <Text x={cloth.x + cloth.w / 2} y={cloth.y + cloth.h + 35} value={d.target} width={cloth.w + 30} anchor="middle" strong color={C.accent} />
    <Text x={compact ? w / 2 : 32} y={h - 18} value={d.actor} width={compact ? w - 36 : w * 0.4} anchor={compact ? "middle" : "start"} color={C.muted} />
  </g>;
}

function Ensemble(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const score = { x: compact ? w * 0.25 : w * 0.36, y: compact ? h * 0.38 : 64, w: compact ? w * 0.5 : w * 0.3, h: compact ? h * 0.41 : h * 0.57 };
  const baton: Point = [w / 2, h - 45];
  return <g>
    <Text x={w / 2} y={27} value={d.source} width={w - 50} anchor="middle" />
    <rect x={score.x} y={score.y} width={score.w} height={score.h} fill={C.paper} stroke={C.line} />
    <Text x={w / 2 + (compact ? 0 : w * 0.01)} y={score.y + 28} value={d.target} width={score.w - 18} anchor="middle" strong />
    {items.map((item, i) => {
      const side = i % 2 ? 1 : -1;
      const start: Point = compact ? [w / 2 + side * w * 0.26, 70 + Math.floor(i / 2) * 43] : [w / 2 + side * w * 0.36, 82 + Math.floor(i / 2) * 102];
      const destination: Point = [w / 2 + (compact ? 0 : w * 0.01), score.y + 65 + i * (score.h - 75) / Math.max(1, items.length - 1)];
      const amount = phase(p, 0.08 + i * 0.16, 0.36 + i * 0.16);
      const x = lerp(start[0], destination[0], amount);
      const y = lerp(start[1], destination[1], amount) - Math.sin(Math.PI * amount) * 16;
      return <g key={i}>
        <path d={`M ${start[0] - 22} ${start[1] + 23} h 44 M ${start[0]} ${start[1] + 23} v 23`} stroke={C.line} opacity={1 - amount * 0.6} />
        <Text x={x} y={y} value={item} width={amount > 0.75 ? score.w - 18 : compact ? w * 0.43 : w * 0.26} anchor="middle" color={amount === 1 ? C.accent : C.ink} />
      </g>;
    })}
    <path d={`M ${baton[0] - 20} ${baton[1] + 8} Q ${baton[0]} ${baton[1] - 9} ${baton[0] + 20} ${baton[1] + 8}`} stroke={C.muted} fill="none" strokeWidth={2} />
    <path d={`M ${baton[0]} ${baton[1]} l ${28 * Math.sin(p * Math.PI * 5)} -31`} stroke={C.accent} strokeWidth={3} strokeLinecap="round" />
    <Text x={compact ? 25 : 35} y={h - 22} value={d.actor} width={compact ? w * 0.38 : w * 0.33} color={C.muted} />
    <Text x={w - 25} y={h - 22} value={d.subject} width={compact ? w * 0.38 : w * 0.33} anchor="end" strong />
  </g>;
}

function Patch(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const file = { x: compact ? 22 : 50, y: 44, w: compact ? w - 44 : w * 0.71, h: h - 104 };
  const slot = { x: file.x + 21, y: file.y + 74, w: file.w - 42, h: Math.min(file.h - 105, 38 * items.length + 18) };
  const settle = phase(p, 0.12, 0.79);
  const patchX = lerp(compact ? file.x + 8 : w * 0.33, slot.x, settle);
  const patchY = lerp(h * 0.64, slot.y, settle);
  return <g>
    <Text x={file.x} y={25} value={d.source} width={file.w} strong />
    <path d={`M ${file.x} ${file.y} H ${file.x + file.w - 20} l 20 20 V ${file.y + file.h} H ${file.x} Z`} fill={C.paper} stroke={C.line} />
    <path d={`M ${file.x + file.w - 20} ${file.y} v 20 h 20`} fill="none" stroke={C.line} />
    <Text x={file.x + 21} y={file.y + 32} value={d.target} width={file.w - 42} strong />
    <path d={`M ${slot.x} ${slot.y - 12} h ${slot.w * 0.7} M ${slot.x} ${slot.y + slot.h + 22} h ${slot.w * 0.82}`} stroke={C.line} strokeWidth={3} />
    <rect x={slot.x} y={slot.y} width={slot.w} height={slot.h} fill={C.soft} stroke={C.line} strokeDasharray="4 5" />
    <g transform={`translate(${patchX} ${patchY}) rotate(${lerp(-7, 0, settle)} ${slot.w / 2} ${slot.h / 2})`}>
      <rect width={slot.w} height={slot.h} fill={C.paper} stroke={C.accent} strokeWidth={1.5} />
      {items.map((item, i) => <g key={i}><path d={`M 10 ${26 + i * 36} h 10 M 15 ${21 + i * 36} v 10`} stroke={C.accent} strokeWidth={1.5} /><Text x={32} y={31 + i * 36} value={item} width={slot.w - 44} /></g>)}
    </g>
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${slot.x + (i + 0.5) * slot.w / 10} ${slot.y - 4} v 8`} stroke={C.accent} strokeWidth={2} opacity={phase(p, 0.76 + i * 0.015, 0.8 + i * 0.015)} />)}
    <Text x={compact ? w - 24 : w - 28} y={compact ? h - 38 : h * 0.56} value={d.subject} width={compact ? w - 48 : w * 0.24} anchor="end" strong color={C.accent} />
    <Text x={file.x} y={h - 16} value={d.actor} width={w - 48} color={C.muted} />
  </g>;
}

function Footprint(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const points: Point[] = compact ? [[w * 0.28, 70], [w * 0.68, h * 0.36], [w * 0.3, h * 0.62], [w * 0.64, h - 70]] : [[55, h - 84], [w * 0.35, h * 0.64], [w * 0.59, h * 0.3], [w - 80, 60]];
  const point = along(points, phase(p, 0.04, 0.92));
  const labelWidth = compact ? w * 0.65 : w * 0.25;
  const labelX = Math.max(labelWidth / 2 + 12, Math.min(w - labelWidth / 2 - 12, point[0]));
  return <g>
    <Text x={compact ? 22 : 34} y={compact ? 28 : h - 26} value={d.source} width={compact ? w - 44 : w * 0.42} strong />
    {!compact && <Text x={34} y={27} value={d.subject} width={w * 0.47} strong />}
    <path d={path(points)} fill="none" stroke={C.line} strokeWidth={1.5} />
    {items.map((item, i) => {
      const position = along(points, (i + 0.7) / (items.length + 0.8));
      const printed = phase(p, 0.1 + i * 0.18, 0.25 + i * 0.18);
      const side = i % 2 ? -1 : 1;
      return <g key={i}>
        <g transform={`translate(${position[0]} ${position[1]}) rotate(${compact ? 22 * side : -34})`}>
          <rect x={-6} y={-13} width={12} height={19} rx={4} fill={C.accent} opacity={printed} />
          <rect x={-5} y={9} width={10} height={7} rx={2} fill={C.accent} opacity={phase(printed, 0.5, 1)} />
        </g>
        <g opacity={printed}><Text x={compact ? position[0] + side * 23 : position[0]} y={compact ? position[1] - 5 : position[1] + side * 39} value={item} width={compact ? w * 0.42 : w * 0.25} anchor={compact ? side > 0 ? "start" : "end" : "middle"} /></g>
      </g>;
    })}
    <g transform={`translate(${point[0]} ${point[1]})`}>
      <path d="M -12 -9 h 24 v 18 h -24 Z M -6 9 v 5 h 12 v -5" fill={C.paper} stroke={C.accent} strokeWidth={2} />
      {compact && <Text x={labelX - point[0]} y={-28} value={d.subject} width={labelWidth} anchor="middle" strong />}
    </g>
    <Text x={w - 23} y={compact ? h - 20 : 27} value={d.target} width={compact ? w - 46 : w * 0.43} anchor="end" strong color={C.accent} />
    <Text x={compact ? 22 : w * 0.56} y={h - 20} value={d.actor} width={compact ? w * 0.5 : w * 0.4} color={C.muted} />
  </g>;
}

function Border(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const boundary = compact ? h * 0.48 : w * 0.52;
  const handoff = phase(p, 0.4, 0.88);
  const opening = lerp(17, Math.max(39, items.length * 18), phase(p, 0.26, 0.58));
  return <g>
    {compact ? <>
      <rect x={20} y={42} width={w - 40} height={boundary - 42} fill={C.soft} />
      <path d={`M 20 ${boundary} H ${w / 2 - opening} M ${w / 2 + opening} ${boundary} H ${w - 20}`} stroke={C.accent} strokeWidth={2} />
    </> : <>
      <rect x={22} y={42} width={boundary - 22} height={h - 75} fill={C.soft} />
      <path d={`M ${boundary} 43 V ${h / 2 - opening} M ${boundary} ${h / 2 + opening} V ${h - 33}`} stroke={C.accent} strokeWidth={2} />
    </>}
    <Text x={compact ? 32 : 34} y={27} value={d.source} width={compact ? w - 64 : w * 0.42} strong />
    <Text x={w - 30} y={compact ? h - 18 : 27} value={d.target} width={compact ? w - 60 : w * 0.4} anchor="end" strong />
    <Text x={compact ? 31 : boundary + 18} y={compact ? h - 48 : 65} value={d.actor} width={compact ? w - 62 : w * 0.4} color={C.muted} />
    {items.map((item, i) => {
      const movement = compact ? handoff : phase(handoff, i * 0.12, 0.64 + i * 0.12);
      const x = compact ? w / 2 : lerp(90, w * 0.66, movement);
      const y = compact ? lerp(110 + i * 36, boundary + 64 + i * 36, movement) : h * 0.5 + (i - (items.length - 1) / 2) * 31;
      return <g key={i}>
        <path d={compact ? `M ${x - 42} ${y - 20} h 84` : `M ${x - 11} ${y - 17} v 25`} stroke={C.accent} opacity={Math.sin(movement * Math.PI)} />
        <Text x={x} y={y} value={item} width={compact ? w - 70 : w * 0.29} anchor={compact ? "middle" : "start"} color={movement === 1 ? C.accent : C.ink} />
      </g>;
    })}
    <path d={compact ? `M ${w / 2 - opening} ${boundary - 7} v 14 M ${w / 2 + opening} ${boundary - 7} v 14` : `M ${boundary - 7} ${h / 2 - opening} h 14 M ${boundary - 7} ${h / 2 + opening} h 14`} stroke={C.accent} strokeWidth={3} />
    <Text x={compact ? w / 2 : boundary - 19} y={compact ? 72 : h - 22} value={d.subject} width={compact ? w - 60 : w * 0.4} anchor={compact ? "middle" : "end"} strong />
  </g>;
}

function Camera(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h, id } = props;
  const compact = w < 640;
  const items = objects(props);
  const image = { x: 26, y: 54, w: compact ? w - 52 : w * 0.57, h: compact ? h * 0.43 : h - 108 };
  const focus = phase(p, 0.24, 0.82);
  const box = { x: image.x + 8, y: image.y + 8, w: image.w - 16, h: image.h - 16 };
  const output = { x: compact ? 45 : w * 0.7, y: compact ? h * 0.68 : h * 0.4, w: compact ? w - 90 : w * 0.25 };
  return <g>
    <defs><clipPath id={`${id}-camera-view`}><rect x={image.x} y={image.y} width={image.w} height={image.h} /></clipPath></defs>
    <Text x={image.x} y={29} value={d.source} width={image.w} strong />
    <rect x={image.x} y={image.y} width={image.w} height={image.h} fill={C.paper} stroke={C.line} />
    <g clipPath={`url(#${id}-camera-view)`}>
      <g transform={`translate(${-image.w * 0.55 * focus} 0)`}>
        {items.map((item, i) => {
          const x = image.x + image.w * ([1.04, 0.4, 0.74, 1.12][i]);
          const y = image.y + image.h * ([0.4, 0.72, 0.22, 0.8][i]);
          return <g key={i}><path d={`M ${x - 40} ${y - 22} h 80 v 46 h -80 Z`} fill={i === 0 ? C.soft : C.paper} stroke={i === 0 ? C.accent : C.line} /><Text x={x} y={y + 4} value={item} width={image.w * 0.4} anchor="middle" /></g>;
        })}
      </g>
    </g>
    <g opacity={1 - phase(p, 0.84, 1)}><Text x={image.x + 17} y={image.y + 29} value={d.action} width={image.w - 34} color={C.accent} /></g>
    <path d={`M ${box.x} ${box.y + 18} v -18 h 18 M ${box.x + box.w - 18} ${box.y} h 18 v 18 M ${box.x + box.w} ${box.y + box.h - 18} v 18 h -18 M ${box.x + 18} ${box.y + box.h} h -18 v -18`} fill="none" stroke={C.accent} strokeWidth={3} />
    <path d={`M ${image.x + image.w * 0.49 - 5} ${image.y + image.h * 0.4} h 10 M ${image.x + image.w * 0.49} ${image.y + image.h * 0.4 - 5} v 10`} stroke={C.accent} opacity={focus} />
    <Text x={image.x + image.w / 2} y={image.y + image.h + 29} value={d.actor} width={image.w} anchor="middle" color={C.muted} />
    <g opacity={phase(p, 0.62, 0.86)}>
      <path d={`M ${output.x} ${output.y - 19} h ${output.w} v 65 h ${-output.w} Z`} fill={C.soft} stroke={C.accent} />
      <Text x={output.x + output.w / 2} y={output.y + 10} value={d.subject} width={output.w - 18} anchor="middle" strong />
    </g>
    <Text x={output.x + output.w / 2} y={output.y + 78} value={d.target} width={output.w + 28} anchor="middle" color={C.accent} />
  </g>;
}

function Canvas(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h, id } = props;
  const compact = w < 640;
  const items = objects(props);
  const board = { x: compact ? 18 : 42, y: 48, w: compact ? w - 36 : w - 84, h: h - 112 };
  const selected = { x: board.x + board.w * 0.3, y: board.y + board.h * 0.24, w: board.w * (compact ? 0.56 : 0.43), h: board.h * 0.53 };
  const edit = phase(p, 0.16, 0.88);
  const penX = selected.x + selected.w * edit;
  const penY = selected.y + selected.h * (0.53 * (1 - edit) ** 3 - 0.54 * (1 - edit) ** 2 * edit + 3.6 * (1 - edit) * edit ** 2 + 0.53 * edit ** 3);
  return <g>
    <defs>
      <clipPath id={`${id}-canvas-region`}><rect x={selected.x} y={selected.y} width={selected.w} height={selected.h} /></clipPath>
      <clipPath id={`${id}-canvas-painted`}><rect x={selected.x} y={selected.y} width={selected.w * edit} height={selected.h} /></clipPath>
    </defs>
    <Text x={board.x} y={28} value={d.source} width={board.w} strong />
    <rect x={board.x} y={board.y} width={board.w} height={board.h} fill={C.paper} stroke={C.line} />
    {items.map((item, i) => {
      const x = board.x + board.w * (i % 2 ? 0.73 : 0.15);
      const y = board.y + board.h * (i < 2 ? 0.17 : 0.85);
      return <Text key={i} x={x} y={y} value={item} width={compact ? board.w * 0.39 : board.w * 0.25} anchor="middle" color={C.muted} />;
    })}
    <g clipPath={`url(#${id}-canvas-region)`}>
      <rect x={selected.x} y={selected.y} width={selected.w * edit} height={selected.h} fill={C.soft} />
      <path d={`M ${selected.x} ${selected.y + selected.h * 0.53} C ${selected.x + selected.w / 3} ${selected.y - selected.h * 0.18} ${selected.x + selected.w * 2 / 3} ${selected.y + selected.h * 1.2} ${selected.x + selected.w} ${selected.y + selected.h * 0.53}`} clipPath={`url(#${id}-canvas-painted)`} fill="none" stroke={C.accent} strokeWidth={4} strokeLinecap="round" />
    </g>
    <rect x={selected.x} y={selected.y} width={selected.w} height={selected.h} fill="none" stroke={C.accent} strokeDasharray="5 4" />
    {[[selected.x, selected.y], [selected.x + selected.w, selected.y], [selected.x, selected.y + selected.h], [selected.x + selected.w, selected.y + selected.h]].map(([x, y], i) => <rect key={i} x={x - 3} y={y - 3} width={6} height={6} fill={C.paper} stroke={C.accent} />)}
    <path d={`M ${penX - 2} ${penY + 3} l 14 -19 l 7 6 l -15 18 Z`} fill={C.paper} stroke={C.accent} strokeWidth={1.5} opacity={1 - phase(p, 0.91, 1)} />
    <Text x={selected.x + selected.w / 2} y={selected.y + selected.h / 2 + 4} value={d.subject} width={selected.w - 20} anchor="middle" strong />
    <Text x={board.x} y={h - 31} value={d.actor} width={board.w * 0.45} color={C.muted} />
    <Text x={board.x + board.w} y={h - 31} value={d.target} width={board.w * 0.49} anchor="end" color={C.accent} strong />
  </g>;
}

function Depth(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const spread = phase(p, 0.05, 0.82);
  const planeW = compact ? w * 0.68 : w * 0.48;
  const gap = compact ? (h - 146) / Math.max(1, items.length) : Math.min(53, (h - 142) / Math.max(1, items.length));
  return <g>
    <Text x={28} y={28} value={d.source} width={w - 56} strong />
    <path d={`M ${w * 0.55} 60 V ${h - 62}`} stroke={C.line} strokeDasharray="3 5" />
    {items.map((item, i) => {
      const x = (w - planeW) / 2 + (compact ? 0 : (i - (items.length - 1) / 2) * 35 * spread);
      const y = lerp(h * 0.42 + i * 5, 69 + i * gap, spread);
      const slant = compact ? 17 : 29;
      return <g key={i}>
        <path d={`M ${x} ${y + slant} l ${planeW - 32} ${-slant} l 32 48 l ${-planeW + 32} ${slant} Z`} fill={C.paper} stroke={C.accent} opacity={0.75 + i * 0.05} />
        <path d={`M ${x + planeW * 0.5} ${y + slant + 3} l 18 -5 l 9 14 l -18 5 Z`} fill={C.soft} stroke={C.accent} />
        <g opacity={i === items.length - 1 ? 1 : phase(spread, 0.45, 0.9)}><Text x={x + 13} y={y + slant + 28} value={item} width={planeW * 0.72} /></g>
      </g>;
    })}
    <g transform={`translate(${w * 0.55} ${lerp(56, h - 65, phase(p, 0.44, 0.97))})`}><path d="M -7 -9 l 7 -4 l 7 4 v 9 l -7 4 l -7 -4 Z" fill={C.accent} /></g>
    <Text x={28} y={h - 31} value={d.subject} width={w * 0.48} strong />
    <Text x={w - 28} y={h - 31} value={d.target} width={w * 0.4} anchor="end" color={C.accent} />
    <Text x={w - 28} y={54} value={d.actor} width={w * 0.47} anchor="end" color={C.muted} />
  </g>;
}

function Circuit(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const chip = { x: compact ? w * 0.3 : w * 0.35, y: compact ? h * 0.34 : h * 0.29, w: compact ? w * 0.4 : w * 0.3, h: compact ? h * 0.28 : h * 0.42 };
  const route: Point[] = compact ? [[32, 67], [chip.x + 14, 67], [chip.x + 14, chip.y + 16], [chip.x + 14, chip.y + chip.h - 16], [chip.x + 14, h - 78], [w - 32, h - 78]] : [[30, h * 0.46], [chip.x - 27, h * 0.46], [chip.x - 27, chip.y + 18], [chip.x + 25, chip.y + 18], [chip.x + 25, chip.y + chip.h - 18], [chip.x + chip.w - 25, chip.y + chip.h - 18], [w - 36, chip.y + chip.h - 18]];
  const point = along(route, phase(p, 0.04, 0.94));
  return <g>
    <Text x={26} y={28} value={d.source} width={w - 52} strong />
    <path d={path(route)} fill="none" stroke={C.line} strokeWidth={4} strokeLinejoin="round" />
    {Array.from({ length: 7 }, (_, i) => <g key={i}>
      <path d={`M ${chip.x - 9} ${chip.y + (i + 1) * chip.h / 8} h 9 M ${chip.x + chip.w} ${chip.y + (i + 1) * chip.h / 8} h 9`} stroke={C.accent} strokeWidth={3} />
      <path d={`M ${chip.x + (i + 1) * chip.w / 8} ${chip.y - 9} v 9 M ${chip.x + (i + 1) * chip.w / 8} ${chip.y + chip.h} v 9`} stroke={C.accent} strokeWidth={3} />
    </g>)}
    <rect x={chip.x} y={chip.y} width={chip.w} height={chip.h} rx={3} fill={C.paper} stroke={C.accent} strokeWidth={2} />
    <rect x={chip.x + 12} y={chip.y + 12} width={chip.w - 24} height={chip.h - 24} fill={C.soft} stroke={C.line} />
    <Text x={chip.x + chip.w / 2} y={chip.y + chip.h / 2} value={d.subject} width={chip.w - 30} anchor="middle" strong />
    {items.map((item, i) => {
      const side = i % 2 ? 1 : -1;
      const x = compact ? w * (side > 0 ? 0.8 : 0.2) : w * (side > 0 ? 0.81 : 0.18);
      const y = compact ? h * (i < 2 ? 0.24 : 0.75) : h * (i < 2 ? 0.22 : 0.81);
      return <g key={i}>
        <path d={`M ${x} ${y + 12} V ${y + 22} H ${chip.x + chip.w * (side > 0 ? 0.82 : 0.18)} V ${chip.y + (i < 2 ? 0 : chip.h)}`} fill="none" stroke={C.line} />
        <rect x={x - 4} y={y + 8} width={8} height={8} fill={phase(p, i * 0.17, 0.35 + i * 0.17) > 0.7 ? C.accent : C.paper} stroke={C.accent} />
        <Text x={x} y={y} value={item} width={compact ? w * 0.36 : w * 0.25} anchor="middle" />
      </g>;
    })}
    <rect x={point[0] - 4} y={point[1] - 4} width={8} height={8} fill={C.accent} />
    <Text x={26} y={h - 20} value={d.actor} width={w * 0.44} color={C.muted} />
    <Text x={w - 26} y={h - 20} value={d.target} width={w * 0.45} anchor="end" strong color={C.accent} />
  </g>;
}

function Bridge(props: NewsMotionSceneProps) {
  const { design: d, progress: p, width: w, height: h } = props;
  const compact = w < 640;
  const items = objects(props);
  const dock = phase(p, 0.08, 0.65);
  const join = phase(p, 0.58, 0.98);
  const center = compact ? h * 0.49 : w * 0.5;
  return <g>
    {compact ? <>
      <path d={`M 29 58 H ${w - 29} V ${center - 52} H 29 Z M 29 ${center + 52} H ${w - 29} V ${h - 56} H 29 Z`} fill={C.paper} stroke={C.line} />
      <Text x={w / 2} y={35} value={d.source} width={w - 58} anchor="middle" strong />
      <Text x={w / 2} y={h - 25} value={d.target} width={w - 58} anchor="middle" strong />
      <g transform={`translate(${lerp(-28, 0, dock)} 0)`}>
        <rect x={38} y={center - 37} width={w - 76} height={74} fill={C.soft} stroke={C.accent} />
        {items.map((_, i) => <path key={i} d={`M ${54 + i * (w - 108) / Math.max(1, items.length - 1)} ${center - 52} v ${15 * dock} M ${54 + i * (w - 108) / Math.max(1, items.length - 1)} ${center + 37} v ${15 * dock}`} stroke={C.accent} strokeWidth={4} />)}
      </g>
      {items.map((item, i) => <g key={i}>
        <Text x={w / 2} y={83 + i * 27 + join * (center + 7)} value={item} width={w - 80} anchor="middle" color={join > 0.8 ? C.accent : C.ink} />
      </g>)}
      <Text x={w / 2} y={center + 6} value={d.subject} width={w - 95} anchor="middle" strong />
      <Text x={w - 26} y={center + 78} value={d.actor} width={w - 52} anchor="end" color={C.muted} />
    </> : <>
      <path d={`M 28 65 H ${center - 108} V ${h - 65} H 28 Z M ${center + 108} 65 H ${w - 28} V ${h - 65} H ${center + 108} Z`} fill={C.paper} stroke={C.line} />
      <Text x={38} y={40} value={d.source} width={w * 0.35} strong />
      <Text x={w - 38} y={40} value={d.target} width={w * 0.35} anchor="end" strong />
      <g transform={`translate(0 ${lerp(38, 0, dock)})`}>
        <rect x={center - 91} y={87} width={182} height={h - 174} fill={C.soft} stroke={C.accent} />
        {items.map((_, i) => <path key={i} d={`M ${center - 108} ${112 + i * (h - 224) / Math.max(1, items.length - 1)} h ${17 * dock} M ${center + 91} ${112 + i * (h - 224) / Math.max(1, items.length - 1)} h ${17 * dock}`} stroke={C.accent} strokeWidth={4} />)}
      </g>
      {items.map((item, i) => <Text key={i} x={lerp(45, center + 125, join)} y={114 + i * (h - 224) / Math.max(1, items.length - 1)} value={item} width={w * 0.23} color={join > 0.8 ? C.accent : C.ink} />)}
      <Text x={center} y={71} value={d.subject} width={200} anchor="middle" strong />
      <Text x={center} y={h - 28} value={d.actor} width={w - 100} anchor="middle" color={C.muted} />
    </>}
  </g>;
}

export function SignalScene(props: NewsMotionSceneProps) {
  switch (props.design.scene) {
    case "lens": return <Lens {...props} />;
    case "router": return <Router {...props} />;
    case "loom": return <Loom {...props} />;
    case "ensemble": return <Ensemble {...props} />;
    case "patch": return <Patch {...props} />;
    case "footprint": return <Footprint {...props} />;
    case "border": return <Border {...props} />;
    case "camera": return <Camera {...props} />;
    case "canvas": return <Canvas {...props} />;
    case "depth": return <Depth {...props} />;
    case "circuit": return <Circuit {...props} />;
    case "bridge": return <Bridge {...props} />;
    default: return null;
  }
}
