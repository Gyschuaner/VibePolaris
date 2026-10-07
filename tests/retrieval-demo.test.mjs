import test from "node:test";
import assert from "node:assert/strict";
import { getRetrievalDemoState } from "../lib/retrieval-demo.ts";

test("semantic retrieval can surface a high-score card without a source", () => {
  const state = getRetrievalDemoState(5, "semantic", 1, "all");
  assert.equal(state.selected?.id, "faq");
  assert.equal(state.selected?.source, null);
  assert.equal(state.status, "missing");
  assert.match(state.statusLabel, /缺证据/);
});

test("removing the unsupported card exposes the sourced policy candidate", () => {
  const state = getRetrievalDemoState(5, "semantic", 1, "all", true);
  assert.equal(state.selected?.id, "policy");
  assert.equal(state.selected?.source, "policy-v3 §2");
  assert.equal(state.status, "citable");
  assert.match(state.statusDetail, /只交付原文/);
});

test("top-k changes the returned candidate set without creating an answer", () => {
  const one = getRetrievalDemoState(4, "hybrid", 1, "all");
  const three = getRetrievalDemoState(4, "hybrid", 3, "all");
  assert.equal(one.visible.length, 1);
  assert.equal(three.visible.length, 3);
  assert.equal(three.status, "candidate");
});

test("policy scope filters the drawer before top-k is applied", () => {
  const state = getRetrievalDemoState(3, "semantic", 3, "policy");
  assert.deepEqual(state.visible.map((candidate) => candidate.id), ["policy"]);
  assert.equal(state.visible[0].source, "policy-v3 §2");
});

test("before the drawer opens, the result area waits", () => {
  const state = getRetrievalDemoState(0, "keyword", 3, "all");
  assert.equal(state.drawerOpen, false);
  assert.equal(state.selected, null);
  assert.equal(state.status, "waiting");
});

test("an empty filtered range stays at missing evidence", () => {
  const state = getRetrievalDemoState(5, "hybrid", 3, "revoked");
  assert.equal(state.visible.length, 0);
  assert.equal(state.selected, null);
  assert.equal(state.status, "missing");
  assert.match(state.statusDetail, /空集/);
});
