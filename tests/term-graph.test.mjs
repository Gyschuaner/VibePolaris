import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { buildTermGraph, graphNeighbors } from "../lib/term-graph.ts";

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
