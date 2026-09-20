import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { buildTermGraph, graphNeighbors, searchGraphNodes } from "../lib/term-graph.ts";

test("星图覆盖真实词条关系，双向关系去重且布局可复现", () => {
  const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
  const terms = [...read("../content/zh/terms.json"), ...readdirSync(new URL("../content/zh/term-batches/", import.meta.url)).filter(name => name.endsWith(".json")).flatMap(name => read(`../content/zh/term-batches/${name}`))];
  const graph = buildTermGraph(terms);
  const slugs = new Set(terms.map(term => term.slug));
  const edgeKeys = new Set(graph.edges.map(edge => [edge.source, edge.target].sort().join("|")));
  assert.equal(graph.nodes.length, terms.length);
  assert.equal(edgeKeys.size, graph.edges.length);
  for (const node of graph.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y));
    assert.equal(graphNeighbors(node.slug, graph.edges).size, node.degree);
    for (const slug of node.relatedSlugs) assert.ok(edgeKeys.has([node.slug, slug].sort().join("|")), `${node.slug} → ${slug}`);
  }
  for (const edge of graph.edges) {
    assert.ok(slugs.has(edge.source) && slugs.has(edge.target));
    assert.notEqual(edge.source, edge.target);
    assert.ok(terms.some(term => term.slug === edge.source && term.relatedSlugs.includes(edge.target) || term.slug === edge.target && term.relatedSlugs.includes(edge.source)));
  }
  const harness = terms.find(term => term.slug === "agent-harness");
  assert.equal(harness.relatedSlugs.length, 8);
  assert.deepEqual(buildTermGraph(terms), graph);
  assert.deepEqual(buildTermGraph([]), { nodes: [], edges: [] });
});

test("统一入口兼容英文、别名、多关键词及领域内搜索", () => {
  const terms = JSON.parse(readFileSync(new URL("../content/zh/terms.json", import.meta.url), "utf8"));
  assert.deepEqual(searchGraphNodes(terms, "  AGENT   HARNESS ").map(node => node.slug), ["agent-harness"]);
  const harness = terms.find(node => node.slug === "agent-harness");
  assert.ok(searchGraphNodes(terms, harness.aliases[0]).includes(harness));
  assert.equal(searchGraphNodes(terms, "harness", "前端").length, 0);
  assert.equal(searchGraphNodes(terms, "不存在的概念xyz").length, 0);
  assert.ok(searchGraphNodes(terms, "", "前端").every(node => node.cat === "前端"));
});
