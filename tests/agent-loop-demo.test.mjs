import test from "node:test";
import assert from "node:assert/strict";

const { getAgentLoopDemoState } = await import("../lib/agent-loop-demo.ts");

test("the repair bench keeps the failed receipt until it writes a new state", () => {
  const receipt = getAgentLoopDemoState(2, 3);
  assert.equal(receipt.receiptVisible, true);
  assert.equal(receipt.receiptCode, "500");
  assert.equal(receipt.receiptCurrent, false);
  assert.equal(receipt.stateWritten, false);
  assert.equal(receipt.finished, false);

  const written = getAgentLoopDemoState(3, 3);
  assert.equal(written.stateWritten, true);
  assert.equal(written.stateLabel, "issue = config");
  assert.equal(written.taskStatus, "500 · 待定位");
  assert.equal(written.finished, false);
  assert.equal(written.receiptCurrent, false);
});

test("writing config is not the same as passing the health check", () => {
  const saved = getAgentLoopDemoState(4, 3);
  assert.equal(saved.stateLabel, "API_BASE_URL = set");
  assert.equal(saved.receiptCode, "500");
  assert.equal(saved.verificationVisible, false);
  assert.equal(saved.finished, false);
});

test("a successful loop shows a new 200 receipt before opening the stop gate", () => {
  const state = getAgentLoopDemoState(6, 3);
  assert.equal(state.finished, true);
  assert.equal(state.limited, false);
  assert.equal(state.receiptCurrent, true);
  assert.equal(state.receiptCode, "200");
  assert.equal(state.taskStatus, "200 · 已验证");
  assert.match(state.gateLabel, /200 OK/);
  assert.match(state.status, /新的 200 OK/);
});

test("max turns stops before the third verification and keeps the task unfinished", () => {
  const state = getAgentLoopDemoState(4, 2);
  assert.equal(state.finished, true);
  assert.equal(state.limited, true);
  assert.equal(state.receiptCode, "500");
  assert.equal(state.receiptCurrent, false);
  assert.match(state.gateLabel, /max_turns=2/);
  assert.match(state.status, /仍未完成/);
});

test("the first frame has no action receipt, write-back, or verification", () => {
  const state = getAgentLoopDemoState(0, 3);
  assert.equal(state.actionVisible, false);
  assert.equal(state.receiptVisible, false);
  assert.equal(state.stateWritten, false);
  assert.equal(state.verificationVisible, false);
  assert.equal(state.finished, false);
});
