import { canvasPorts, type CanvasPort } from "./canvas.ts";

type Point = { x: number; y: number };
export type CanvasAnchor = Point & { side?: CanvasPort };
export type CanvasLabelBounds = Point & { width: number; height: number };
type Box = { left: number; top: number; right: number; bottom: number };
const normals: Record<CanvasPort, Point> = { top: { x: 0, y: -1 }, right: { x: 1, y: 0 }, bottom: { x: 0, y: 1 }, left: { x: -1, y: 0 } };
const offset = (point: Point, normal: Point, amount: number): Point => ({ x: point.x + normal.x * amount, y: point.y + normal.y * amount });
const lerp = (a: Point, b: Point, t: number): Point => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const middle = (a: Point, b: Point): Point => lerp(a, b, .5);
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const inside = (point: Point, box: Box) => point.x > box.left && point.x < box.right && point.y > box.top && point.y < box.bottom;

export function portAnchor(bounds: CanvasLabelBounds, side: CanvasPort): CanvasAnchor {
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  const amount = (side === "left" || side === "right" ? bounds.width : bounds.height) / 2 + 14;
  return { ...offset(center, normals[side], amount), side };
}

export function edgeAnchors(from: CanvasLabelBounds, to: CanvasLabelBounds) {
  let best: { from: CanvasAnchor; to: CanvasAnchor; fromPort: CanvasPort; toPort: CanvasPort } | undefined, score = Infinity;
  for (const fromPort of canvasPorts) for (const toPort of canvasPorts) {
    const a = portAnchor(from, fromPort), b = portAnchor(to, toPort), length = distance(a, b);
    const direction = { x: (b.x - a.x) / (length || 1), y: (b.y - a.y) / (length || 1) };
    const facing = direction.x * normals[fromPort].x + direction.y * normals[fromPort].y - direction.x * normals[toPort].x - direction.y * normals[toPort].y;
    const cost = length + (2 - facing) * 45;
    if (cost < score) { score = cost; best = { from: a, to: b, fromPort, toPort }; }
  }
  return best!;
}

function intersectsSegment(a: Point, b: Point, box: Box) {
  let enter = 0, exit = 1;
  for (const [start, delta, min, max] of [[a.x, b.x - a.x, box.left, box.right], [a.y, b.y - a.y, box.top, box.bottom]]) {
    if (Math.abs(delta) < 1e-8) { if (start <= min || start >= max) return false; }
    else {
      const first = (min - start) / delta, last = (max - start) / delta;
      enter = Math.max(enter, Math.min(first, last)); exit = Math.min(exit, Math.max(first, last));
    }
  }
  return enter < exit - 1e-8;
}

function intersectsCurve(points: Point[], box: Box, depth = 0): boolean {
  if (Math.max(...points.map(p => p.x)) <= box.left || Math.min(...points.map(p => p.x)) >= box.right
    || Math.max(...points.map(p => p.y)) <= box.top || Math.min(...points.map(p => p.y)) >= box.bottom) return false;
  if (depth === 12 || inside(points[0], box) || inside(points[3], box)) return true;
  const a = middle(points[0], points[1]), b = middle(points[1], points[2]), c = middle(points[2], points[3]);
  const d = middle(a, b), e = middle(b, c), f = middle(d, e);
  return intersectsCurve([points[0], a, d, f], box, depth + 1) || intersectsCurve([f, e, c, points[3]], box, depth + 1);
}

function roundedPath(route: Point[], obstacles: Box[]) {
  const points = route.filter((point, index) => index === 0 || distance(point, route[index - 1]) > 1e-8);
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index++) {
    const before = points[index - 1], point = points[index], after = points[index + 1];
    let radius = Math.min(56, distance(before, point) / 2, distance(point, after) / 2);
    const toward = (other: Point): Point => {
      const ratio = radius / distance(point, other);
      return { x: point.x + (other.x - point.x) * ratio, y: point.y + (other.y - point.y) * ratio };
    };
    let start = toward(before), end = toward(after);
    // A larger turn stays soft, but may never cut through a label's reserved space.
    while (radius > 1 && obstacles.some(box => intersectsCurve([start, lerp(start, point, 2 / 3), lerp(end, point, 2 / 3), end], box))) {
      radius /= 2; start = toward(before); end = toward(after);
    }
    if (radius <= 1) { path += ` L ${point.x} ${point.y}`; continue; }
    path += ` L ${start.x} ${start.y} Q ${point.x} ${point.y}, ${end.x} ${end.y}`;
  }
  const last = points[points.length - 1];
  return `${path} L ${last.x} ${last.y}`;
}

export function connectionPath(from: CanvasAnchor, to: CanvasAnchor, labels: CanvasLabelBounds[]) {
  const boxes = labels.map(label => ({ left: label.x - 10, top: label.y - 10, right: label.x + label.width + 10, bottom: label.y + label.height + 10 }));
  const fromNormal = normals[from.side ?? (to.x >= from.x ? "right" : "left")], toNormal = normals[to.side ?? (to.x >= from.x ? "left" : "right")];
  const bend = Math.max(40, Math.min(180, distance(from, to) * .45));
  const controls = [from, offset(from, fromNormal, bend), offset(to, toNormal, bend), to];
  const curve = `M ${from.x} ${from.y} C ${controls[1].x} ${controls[1].y}, ${controls[2].x} ${controls[2].y}, ${to.x} ${to.y}`;
  if (!boxes.some(box => intersectsCurve(controls, box))) return curve;

  // shortcut: overlapping labels can cover a port; route around all other labels until they are moved apart.
  const obstacles = boxes.filter(box => !inside(from, box) && !inside(to, box));
  function lead(point: Point, normal: Point) {
    for (let amount = Math.min(48, distance(from, to) / 3); amount >= 4; amount /= 2) {
      const next = offset(point, normal, amount);
      if (!obstacles.some(box => intersectsSegment(point, next, box) || inside(next, box))) return next;
    }
    return point;
  }
  const first = lead(from, fromNormal), last = lead(to, toNormal);
  const corners = obstacles.flatMap(box => [
    { x: box.left - 26, y: box.top - 26 }, { x: box.right + 26, y: box.top - 26 },
    { x: box.right + 26, y: box.bottom + 26 }, { x: box.left - 26, y: box.bottom + 26 },
  ]).filter(point => !obstacles.some(box => inside(point, box)));
  const points = [first, last, ...new Map(corners.map(point => [`${point.x},${point.y}`, point])).values()];
  const costs = points.map(() => Infinity), previous = points.map(() => -1), visited = new Set<number>();
  costs[0] = 0;
  while (visited.size < points.length) {
    let current = -1;
    for (let index = 0; index < points.length; index++) if (!visited.has(index) && (current < 0 || costs[index] < costs[current])) current = index;
    if (current < 0 || !Number.isFinite(costs[current])) break;
    if (current === 1) {
      const route: Point[] = [];
      for (let index = 1; index >= 0; index = previous[index]) route.unshift(points[index]);
      return roundedPath([from, ...route, to], obstacles);
    }
    visited.add(current);
    for (let index = 0; index < points.length; index++) {
      if (visited.has(index)) continue;
      const cost = costs[current] + distance(points[current], points[index]);
      if (cost >= costs[index] || obstacles.some(box => intersectsSegment(points[current], points[index], box))) continue;
      costs[index] = cost; previous[index] = current;
    }
  }
  return curve;
}
