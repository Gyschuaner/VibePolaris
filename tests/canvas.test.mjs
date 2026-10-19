import assert from "node:assert/strict";
import test from "node:test";
import { availablePosition, connectNodes, emptyCanvas, markdownFileName, moveView, nodePreview, parseCanvas } from "../lib/canvas.ts";

const note = (id, markdown) => ({ id, markdown, fileName: "", x: 20, y: -40, createdAt: "2026-10-19T02:00:00.000Z", updatedAt: "2026-10-19T02:00:00.000Z" });

test("自由 Markdown 可无标题；标题、简述与安全导出文件名不改变正文", () => {
  const input = note("one", "# 一个网站点子\n\n把 **灵感** 放在一起。\n\n[参考](/terms/css)");
  assert.deepEqual(nodePreview(input), { title: "一个网站点子", summary: "把 灵感 放在一起。" });
  assert.equal(nodePreview(note("two", "有些东西，先留下就好。")).title, "有些东西，先留下就好。");
  assert.equal(nodePreview({ markdown: "", fileName: "读书随记.md" }).title, "读书随记");
  assert.equal(nodePreview(note("empty", "")).title, "未命名笔记");
  assert.equal(markdownFileName(note("unsafe", "# A/B:想法")), "A_B_想法.md");
  assert.equal(input.markdown, "# 一个网站点子\n\n把 **灵感** 放在一起。\n\n[参考](/terms/css)");
});

test("新建和导入避开已有节点，窄画布逐行放置", () => {
  const existing = [{ x: 0, y: 0 }, { x: 330, y: 0 }];
  assert.deepEqual(availablePosition(existing, { x: 0, y: 0 }), { x: 660, y: 0 });
  assert.deepEqual(availablePosition(existing, { x: 0, y: 0 }, 1), { x: 0, y: 170 });
});

test("连线不重复、不自连、不指向不存在的节点；损坏存储不作为空画布覆盖", () => {
  const data = { ...emptyCanvas(), nodes: [note("a", "A"), note("b", "B")] };
  const linked = connectNodes(data, "a", "b");
  assert.equal(linked.edges.length, 1);
  assert.equal(connectNodes(linked, "b", "a"), linked);
  assert.equal(connectNodes(linked, "a", "a"), linked);
  assert.equal(connectNodes(linked, "a", "missing"), linked);
  assert.deepEqual(parseCanvas(linked), linked);
  assert.throws(() => parseCanvas({ ...linked, nodes: [note("a", "A")] }));
  assert.throws(() => parseCanvas({ ...linked, nodes: [note("a", "A"), note("a", "B")] }));
  assert.throws(() => parseCanvas({ ...linked, view: { x: Infinity, y: 0, scale: 1 } }));
});

test("缩放保持指针下的画布坐标，并限制可用缩放范围", () => {
  const view = { x: 80, y: -40, scale: 1 };
  const next = moveView(view, 1.6, 300, 200);
  assert.equal((300 - next.x) / next.scale, (300 - view.x) / view.scale);
  assert.equal((200 - next.y) / next.scale, (200 - view.y) / view.scale);
  assert.equal(moveView(view, 10, 0, 0).scale, 2);
  assert.equal(moveView(view, .01, 0, 0).scale, .3);
});
