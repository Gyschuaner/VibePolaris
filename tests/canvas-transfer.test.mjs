import assert from "node:assert/strict";
import test from "node:test";
import { emptyCanvas } from "../lib/canvas.ts";
import { canvasTexts, decodeCanvas, encodeCanvas, knownCanvasTexts } from "../lib/canvas-transfer.ts";

test("同步复用已有图片与长正文，移动和独立正文修改可完整往返", async () => {
  const markdown = "# DOM\n\n![截图](data:image/png;base64," + "abcd".repeat(200_000) + ")";
  const article = { markdown: markdown + "\n\n整理后的文章。", sourceHash: "hash", generatedAt: "2026-10-27T00:00:00Z", complete: true };
  const node = { id: "dom", markdown, article, fileName: "", x: 20, y: 30, createdAt: "2026-10-27T00:00:00Z", updatedAt: "2026-10-27T00:00:00Z" };
  const before = { ...emptyCanvas(), nodes: [node], revision: 1 };
  const texts = await canvasTexts(before), known = new Set(texts.keys());
  const moved = { ...before, nodes: [{ ...node, x: 220, summary: "新摘要" }], revision: 2 };
  const packed = await encodeCanvas(moved, known);
  assert.ok(JSON.stringify(packed).length < 1000);
  assert.deepEqual(decodeCanvas(packed, texts), moved);
  const changed = { ...moved, nodes: [{ ...moved.nodes[0], markdown: markdown + "\n新增文字" }] };
  const download = await encodeCanvas(changed, known);
  assert.equal(download.nodes[0].markdown, changed.nodes[0].markdown);
  assert.deepEqual(decodeCanvas(download, texts), changed);
  const response = await encodeCanvas(changed, new Set((await canvasTexts(changed)).keys()));
  assert.ok(JSON.stringify(response).length < 1000);
  assert.deepEqual(decodeCanvas(response, await canvasTexts(changed)), changed);
  assert.deepEqual(await encodeCanvas(before, new Set()), before);
  assert.throws(() => decodeCanvas(packed, new Map()), /尚未缓存/);
});

test("未知引用与损坏结构拒绝还原；摘要清单有边界", async () => {
  const data = emptyCanvas();
  assert.throws(() => decodeCanvas({ ...data, view: { $canvasText: "missing" } }, new Map()), /尚未缓存/);
  assert.throws(() => decodeCanvas({ ...data, edges: [{ id: "bad", from: "a", to: "b" }] }, new Map()));
  const hashes = Array.from({ length: 80 }, (_, index) => index.toString(16).padStart(64, "0"));
  assert.equal(knownCanvasTexts(hashes.join(",")).size, 64);
  assert.equal(knownCanvasTexts("not-a-hash").size, 0);
  assert.equal(knownCanvasTexts(null).size, 0);
});
