import assert from "node:assert/strict";
import test from "node:test";
import { CanvasPinch } from "../lib/canvas-pinch.ts";
const sameView = (actual, expected) => { for (const key of ["x", "y", "scale"]) assert.ok(Math.abs(actual[key] - expected[key]) < 1e-9, key); };

test("双指缩放和平移保持中点对应的世界坐标，并沿用缩放上下限", () => {
  const pinch = new CanvasPinch(), view = { x: 40, y: -20, scale: .8 };
  assert.equal(pinch.down(1, { x: 100, y: 100 }, view), false);
  assert.equal(pinch.down(2, { x: 300, y: 100 }, view), true);
  pinch.move(1, { x: 70, y: 150 });
  const next = pinch.move(2, { x: 470, y: 150 });
  assert.equal(next.scale, 1.6);
  assert.equal((270 - next.x) / next.scale, (200 - view.x) / view.scale);
  assert.equal((150 - next.y) / next.scale, (100 - view.y) / view.scale);
  assert.equal(pinch.move(2, { x: 2000, y: 150 }).scale, 2);
  assert.equal(pinch.move(2, { x: 71, y: 150 }).scale, .3);
});

test("抬起或取消一个触点后仍占有手势，不会把余下手指当成节点拖动；全部释放后可再次操作", () => {
  const pinch = new CanvasPinch(), view = { x: 0, y: 0, scale: 1 };
  pinch.down(3, { x: 10, y: 20 }, view);
  pinch.down(4, { x: 110, y: 20 }, view);
  assert.equal(pinch.up(3, view), true);
  assert.equal(pinch.active, true);
  assert.equal(pinch.move(4, { x: 200, y: 300 }), null);
  assert.equal(pinch.up(99, view), false);
  assert.equal(pinch.active, true);
  assert.equal(pinch.up(4, view), true);
  assert.equal(pinch.active, false);
  assert.equal(pinch.down(5, { x: 0, y: 0 }, view), false);
  pinch.reset();
  assert.equal(pinch.points.size, 0);
  assert.equal(pinch.move(5, { x: 30, y: 30 }), null);
});

test("第三个触点的加入与离开重新定基，不跳变，也能从重合触点安全开始", () => {
  const pinch = new CanvasPinch(), view = { x: 10, y: 20, scale: 1 };
  pinch.down(1, { x: 50, y: 50 }, view);
  pinch.down(2, { x: 150, y: 50 }, view);
  const moved = pinch.move(2, { x: 180, y: 50 });
  pinch.down(3, { x: 280, y: 80 }, moved);
  sameView(pinch.move(3, { x: 280, y: 80 }), moved);
  pinch.up(1, moved);
  sameView(pinch.move(3, { x: 280, y: 80 }), moved);
  pinch.reset();
  pinch.down(1, { x: 0, y: 0 }, view);
  pinch.down(2, { x: 0, y: 0 }, view);
  assert.ok(Object.values(pinch.move(2, { x: 0, y: 0 })).every(Number.isFinite));
});
