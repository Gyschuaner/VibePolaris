import test from "node:test";
import assert from "node:assert/strict";

const { getAgentOrchestrationDemoState } = await import("../lib/agent-orchestration-demo.ts");

test("parallel work can start together while writing stays locked", () => {
  const state = getAgentOrchestrationDemoState(1, "parallel");
  assert.equal(state.research, "running");
  assert.equal(state.verify, "running");
  assert.equal(state.write, "waiting");
  assert.equal(state.report, "queued");
});

test("serial mode keeps verification queued until retrieval returns", () => {
  const state = getAgentOrchestrationDemoState(1, "serial");
  assert.equal(state.research, "running");
  assert.equal(state.verify, "queued");
  assert.match(state.status, /串行模式/);
});

test("a conflict blocks writing and merge", () => {
  const state = getAgentOrchestrationDemoState(3, "parallel", true, false);
  assert.equal(state.verify, "conflict");
  assert.equal(state.write, "locked");
  assert.equal(state.report, "queued");
  assert.equal(state.evidenceCount, 8);
  assert.match(state.status, /锁住/);
});

test("clearing the conflict produces seven evidence items and a report", () => {
  const state = getAgentOrchestrationDemoState(5, "parallel", true, true);
  assert.equal(state.verify, "ready");
  assert.equal(state.write, "ready");
  assert.equal(state.evidenceCount, 7);
  assert.equal(state.report, "ready");
  assert.match(state.status, /可以交付/);
});
