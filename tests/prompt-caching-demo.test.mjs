import test from "node:test";
import assert from "node:assert/strict";
import { getPromptCachingDemoState } from "../lib/prompt-caching-demo.ts";

test("the first request saves computed input without reusing it", () => {
  const state = getPromptCachingDemoState(1);
  assert.equal(state.cacheSaved, true);
  assert.equal(state.reusedSegments, 0);
  assert.equal(state.status, "saved");
  assert.match(state.cacheStamp, /写入/);
});

test("changing only the tail question reuses the first three segments", () => {
  const state = getPromptCachingDemoState(2, "question");
  assert.equal(state.reusedSegments, 3);
  assert.equal(state.status, "hit");
  assert.deepEqual(state.segments.map((segment) => segment.state), ["reused", "reused", "reused", "changed"]);
  assert.match(state.response, /本次新回答/);
});

test("changing the middle tools segment stops reuse after the first segment", () => {
  const state = getPromptCachingDemoState(3, "tools");
  assert.equal(state.reusedSegments, 1);
  assert.equal(state.status, "partial");
  assert.deepEqual(state.segments.map((segment) => segment.state), ["reused", "changed", "recompute", "recompute"]);
});

test("changing the system prefix removes every reusable segment", () => {
  const state = getPromptCachingDemoState(3, "system");
  assert.equal(state.reusedSegments, 0);
  assert.equal(state.status, "miss");
  assert.equal(state.segments[0].state, "changed");
});

test("a different model or expired cache blocks a prefix hit", () => {
  assert.equal(getPromptCachingDemoState(4, "question", false, true).status, "miss");
  assert.equal(getPromptCachingDemoState(5, "question", true, false).status, "miss");
  assert.equal(getPromptCachingDemoState(5, "question", true, false).reusedSegments, 0);
});
