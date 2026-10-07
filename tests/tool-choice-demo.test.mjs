import test from "node:test";
import assert from "node:assert/strict";

const { getToolChoiceDemoState } = await import("../lib/tool-choice-demo.ts");

test("auto exposes the update proposal, then pauses before the calendar side effect", () => {
  const proposed = getToolChoiceDemoState(2, "auto");
  assert.equal(proposed.selected, "calendar_update");
  assert.equal(proposed.proposed, true);
  assert.equal(proposed.approvalWaiting, false);
  assert.equal(proposed.calendarChanged, false);

  const waiting = getToolChoiceDemoState(3, "auto");
  assert.equal(waiting.approvalWaiting, true);
  assert.match(waiting.status, /等待审批/);
  assert.equal(waiting.calendarChanged, false);
});

test("none keeps the candidates from becoming a tool call", () => {
  const state = getToolChoiceDemoState(3, "none");
  assert.equal(state.candidatesVisible, true);
  assert.equal(state.selected, null);
  assert.equal(state.proposed, false);
  assert.equal(state.approvalWaiting, false);
  assert.match(state.status, /不提出工具调用/);
});

test("the first frame is an unopened turntable for every strategy", () => {
  for (const strategy of ["auto", "required", "none"]) {
    const state = getToolChoiceDemoState(0, strategy);
    assert.equal(state.candidatesVisible, false);
    assert.equal(state.calendarChanged, false);
  }
});
