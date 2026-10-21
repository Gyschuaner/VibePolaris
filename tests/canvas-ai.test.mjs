import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { addSuggestions, resolveSuggestions, sourceHash, sourceResources } from "../lib/canvas-ai.ts";
import { emptyCanvas, parseCanvas, exportNodeMarkdown, importNodeMarkdown } from "../lib/canvas.ts";
import { mergeCanvas } from "../lib/canvas-sync.ts";
import { XiaobeiStore, digest, DAILY_CREDITS } from "../lib/xiaobei/store.ts";

const node = { id: "source", kind: "note", markdown: "# HTTP\n原始问题", fileName: "", x: 0, y: 0, createdAt: "2026-10-21T00:00:00Z", updatedAt: "2026-10-21T00:00:00Z" };
test("文章与原稿独立迁移、合并；并发编辑文章保留冲突处理", async () => {
  const base = parseCanvas({ ...emptyCanvas(), version: 3, nodes: [node] });
  const article = { markdown: "# 学习文章", sourceHash: await sourceHash(node.markdown), generatedAt: node.updatedAt, complete: true };
  const remote = { ...base, nodes: [{ ...node, article }] }, local = { ...base, nodes: [{ ...node, markdown: "修改原稿" }] };
  const merged = mergeCanvas(base, local, remote);
  assert.equal(merged.nodes[0].markdown, "修改原稿"); assert.deepEqual(parseCanvas(merged).nodes[0].article, article);
  assert.notEqual(await sourceHash("修改原稿"), article.sourceHash);
  assert.equal(mergeCanvas(remote, { ...remote, nodes: [{ ...remote.nodes[0], article: { ...article, markdown: "A" } }] }, { ...remote, nodes: [{ ...remote.nodes[0], article: { ...article, markdown: "B" } }] }), null);
});
test("扩展只采用提供的资源、保留来源、避免重复且不覆盖原节点", () => {
  const resources = sourceResources("![示意图](https://example.com/image.png) [文档](https://example.com/docs)");
  const suggestions = resolveSuggestions({ nodes: [
    { kind: "note", title: "状态码", summary: "响应结果", markdown: "简短解释。" },
    { kind: "image", title: "已有图", summary: "图解", markdown: "原图。", resourceId: resources[0].id },
    { kind: "image", title: "虚构图", summary: "", markdown: "", resourceId: "invented" },
  ] }, resources);
  assert.equal(suggestions.length, 2);
  const base = { ...emptyCanvas(), nodes: [node] }, next = addSuggestions(base, node.id, "draft", suggestions);
  assert.equal(next.nodes.length, 3); assert.deepEqual(next.nodes[0], node); assert.ok(next.edges.every(edge => edge.dashed));
  assert.equal(addSuggestions(next, node.id, "draft", suggestions).nodes.length, 3);
  assert.equal(addSuggestions(base, "missing", "draft", suggestions), base);
  const generated = parseCanvas(next).nodes[1]; assert.equal(generated.ai.status, "pending");
  const imported = importNodeMarkdown(exportNodeMarkdown(generated)); assert.equal(imported.ai.status, "accepted"); assert.match(imported.markdown, /小北生成/);
});
test("三个画布功能与聊天独立占用，免费整理/扩展按原价计量但不扣分", () => {
  const store = new XiaobeiStore(":memory:");
  try {
    const invite = store.createInvite("canvas-ai-test"), session = store.activate(invite.code, digest("test")), identity = store.identity(session.token);
    for (const feature of ["chat", "canvas_completion", "canvas_organize", "canvas_expand"]) {
      const run = randomUUID(); store.startRun(identity, run, Date.now(), 0, feature);
      assert.throws(() => store.startRun(identity, randomUUID(), Date.now(), 0, feature), /正在回答/);
      if (feature === "canvas_organize" || feature === "canvas_expand") {
        const reservation = store.reserve(identity, run, 1000, 16384, Date.now(), { feature, charge: false });
        store.settle(reservation.id, { input: 500, cached: 0, output: 100 });
        const row = store.db.prepare("SELECT * FROM usage WHERE id=?").get(reservation.id);
        assert.equal(row.feature, feature); assert.equal(row.cost, 0); assert.equal(row.calculated_cost, 8000);
      }
    }
    assert.equal(store.balance(invite.id), DAILY_CREDITS);
  } finally { store.close(); }
});
