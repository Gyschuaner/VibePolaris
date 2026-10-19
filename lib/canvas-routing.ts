type Point = { x: number; y: number };
export type CanvasLabelBounds = Point & { width: number; height: number };
type Box = { left: number; top: number; right: number; bottom: number };
const middle = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const inside = (point: Point, box: Box) => point.x > box.left && point.x < box.right && point.y > box.top && point.y < box.bottom;

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

function roundedPath(points: Point[]) {
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index++) {
    const before = points[index - 1], point = points[index], after = points[index + 1];
    const radius = Math.min(8, distance(before, point) / 2, distance(point, after) / 2);
    const toward = (other: Point) => {
      const ratio = radius / distance(point, other);
      return { x: point.x + (other.x - point.x) * ratio, y: point.y + (other.y - point.y) * ratio };
    };
    const start = toward(before), end = toward(after);
    path += ` L ${start.x} ${start.y} Q ${point.x} ${point.y}, ${end.x} ${end.y}`;
  }
  const last = points[points.length - 1];
  return `${path} L ${last.x} ${last.y}`;
}

export function connectionPath(from: Point, to: Point, labels: CanvasLabelBounds[]) {
  const boxes = labels.map(label => ({ left: label.x - 10, top: label.y - 10, right: label.x + label.width + 10, bottom: label.y + label.height + 10 }));
  const bend = Math.max(50, Math.abs(to.x - from.x) * .45) * (to.x >= from.x ? 1 : -1);
  const controls = [from, { x: from.x + bend, y: from.y }, { x: to.x - bend, y: to.y }, to];
  const curve = `M ${from.x} ${from.y} C ${controls[1].x} ${controls[1].y}, ${controls[2].x} ${controls[2].y}, ${to.x} ${to.y}`;
  if (!boxes.some(box => intersectsCurve(controls, box))) return curve;

  // shortcut: overlapping labels can cover a port; route around all other labels until they are moved apart.
  const obstacles = boxes.filter(box => !inside(from, box) && !inside(to, box));
  const corners = obstacles.flatMap(box => [
    { x: box.left, y: box.top }, { x: box.right, y: box.top }, { x: box.right, y: box.bottom }, { x: box.left, y: box.bottom },
  ]).filter(point => distance(point, from) > 1e-8 && distance(point, to) > 1e-8 && !obstacles.some(box => inside(point, box)));
  const points = [from, to, ...new Map(corners.map(point => [`${point.x},${point.y}`, point])).values()];
  const costs = points.map(() => Infinity), previous = points.map(() => -1), visited = new Set<number>();
  costs[0] = 0;
  while (visited.size < points.length) {
    let current = -1;
    for (let index = 0; index < points.length; index++) if (!visited.has(index) && (current < 0 || costs[index] < costs[current])) current = index;
    if (current < 0 || !Number.isFinite(costs[current])) break;
    if (current === 1) {
      const route: Point[] = [];
      for (let index = 1; index >= 0; index = previous[index]) route.unshift(points[index]);
      return roundedPath(route);
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
