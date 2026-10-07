import test from "node:test";
import assert from "node:assert/strict";
import { getRoutingDialState } from "../lib/model-routing-demo.ts";

test("the dial stays before execution while the ticket is unopened", () => {
  const state = getRoutingDialState(0, "extract", 90, true);
  assert.equal(state.status, "ticket");
  assert.equal(state.selected, null);
  assert.match(state.statusDetail, /还没有被调用/);
});

test("a simple extraction pins the cheaper eligible model", () => {
  const state = getRoutingDialState(2, "extract", 90, true);
  assert.equal(state.selected, "A");
  assert.equal(state.candidates.find((candidate) => candidate.id === "A")?.state, "picked");
  assert.equal(state.candidates.find((candidate) => candidate.id === "B")?.state, "idle");
});

test("analysis routes to the stronger model after A misses the threshold", () => {
  const state = getRoutingDialState(3, "analysis", 90, true);
  assert.equal(state.selected, "B");
  assert.equal(state.candidates.find((candidate) => candidate.id === "A")?.reason, "离线分数低于 90");
});

test("image work blocks the unavailable light model and keeps B", () => {
  const state = getRoutingDialState(4, "image", 90, true);
  assert.equal(state.selected, "B");
  assert.equal(state.candidates.find((candidate) => candidate.id === "A")?.reason, "不支持图片输入");
});

test("a high threshold or unavailable B leaves the router stopped", () => {
  assert.equal(getRoutingDialState(5, "extract", 98, true).selected, null);
  assert.equal(getRoutingDialState(4, "image", 90, false).selected, null);
});
