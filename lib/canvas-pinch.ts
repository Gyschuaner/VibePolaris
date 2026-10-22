import { moveView, type CanvasView } from "./canvas.ts";

type Point = { x: number; y: number };

// Keep ownership until every finger lifts, so a pinch cannot turn into a node drag or click.
export class CanvasPinch {
  points = new Map<number, Point>();
  active = false;
  private start: { center: Point; distance: number; view: CanvasView } | null = null;

  private rebase(view: CanvasView) {
    const [a, b] = this.points.values();
    this.start = a && b ? {
      center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), view,
    } : null;
  }

  down(id: number, point: Point, view: CanvasView) {
    this.points.set(id, point);
    if (this.points.size >= 2) { this.active = true; this.rebase(view); }
    return this.active;
  }

  move(id: number, point: Point): CanvasView | null {
    if (!this.points.has(id)) return null;
    this.points.set(id, point);
    const [a, b] = this.points.values(), start = this.start;
    if (!this.active || !start || !a || !b) return null;
    const view = moveView(start.view, start.view.scale * Math.hypot(a.x - b.x, a.y - b.y) / start.distance, start.center.x, start.center.y);
    return { ...view, x: view.x + (a.x + b.x) / 2 - start.center.x, y: view.y + (a.y + b.y) / 2 - start.center.y };
  }

  up(id: number, view: CanvasView) {
    if (!this.points.delete(id)) return false;
    const claimed = this.active;
    this.rebase(view);
    if (!this.points.size) this.active = false;
    return claimed;
  }

  reset() { this.points.clear(); this.start = null; this.active = false; }
}
