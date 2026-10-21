import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { addSuggestions, expansionContext, expansionContextSchema, resolveSuggestions, sourceHash, sourceResources } from "../lib/canvas-ai.ts";
import { emptyCanvas, parseCanvas, exportNodeMarkdown, importNodeMarkdown } from "../lib/canvas.ts";
import { mergeCanvas } from "../lib/canvas-sync.ts";
import { XiaobeiStore, digest, DAILY_CREDITS } from "../lib/xiaobei/store.ts";

const node = { id: "source", kind: "note", markdown: "# HTTP\n原始问题", fileName: "", x: 0, y: 0, createdAt: "2026-10-21T00:00:00Z", updatedAt: "2026-10-21T00:00:00Z" };
test("扩展只带一跳邻居，正确解释双端箭头，并限制正文与候选上下文", () => {
  const directions = [undefined, "none", "start", "end", "both"];
  const edges = directions.flatMap((direction, index) => [false, true].map(reverse => ({ id: `${index}-${reverse}`, from: reverse ? `${index}-${reverse}` : "source", to: reverse ? "source" : `${index}-${reverse}`, direction, dashed: true })));
  const neighbors = edges.map((edge, index) => ({ ...node, id: edge.id, title: `邻居${index}`, summary: "已连接的内容", markdown: "草稿节选", ...(index === 0 ? { article: { markdown: "已确认文章", complete: true } } : {}), ...(index === 1 ? { articleProposal: { markdown: "待采用文章", complete: true } } : {}) }));
  const graph = { ...emptyCanvas(), nodes: [node, ...neighbors, { ...node, id: "unrelated", markdown: "不能发送的无关正文" }], edges: [...edges, { id: "second-hop", from: neighbors[0].id, to: "unrelated" }] };
  const context = expansionContext(graph, "source", "article");
  assert.equal(context.sourceVariant, "article"); assert.equal(context.neighbors.length, 10);
  assert.deepEqual(context.neighbors.map(item => item.relation), ["undirected", "undirected", "undirected", "undirected", "incoming", "outgoing", "outgoing", "incoming", "both", "both"]);
  assert.equal(context.neighbors[0].excerpt, "已确认文章"); assert.equal(context.neighbors[0].contentVariant, "article");
  assert.equal(context.neighbors[1].excerpt, "草稿节选"); assert.equal(context.neighbors[1].contentVariant, "draft");
  assert.ok(context.neighbors.every(item => item.dashed && !item.pending));
  assert.ok(!JSON.stringify(context).includes("不能发送"));
  const many = Array.from({ length: 30 }, (_, i) => ({ ...node, id: `large-${i}`, markdown: `![图片](data:image/png;base64,${"A".repeat(5000)})\n${"正文".repeat(800)}`, ...(i === 0 ? { ai: { status: "pending" } } : {}) }));
  const bounded = expansionContext({ ...emptyCanvas(), nodes: [node, ...many], edges: many.map(item => ({ id: item.id, from: "source", to: item.id })) }, "source", "draft");
  assert.equal(bounded.neighbors.length, 24); assert.equal(bounded.omitted, 6);
  assert.ok(bounded.neighbors.every(item => !item.pending && item.excerpt.length === 800 && !item.excerpt.includes("base64")));
  assert.equal(expansionContext({ ...emptyCanvas(), nodes: [node, many[0]], edges: [{ from: "source", to: many[0].id }] }, "source", "draft").neighbors[0].pending, true);
  assert.throws(() => expansionContextSchema.parse({ ...bounded, neighbors: [...bounded.neighbors, bounded.neighbors[0]] }));
  assert.deepEqual(expansionContext(graph, "missing", "draft").neighbors, []);
});
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
