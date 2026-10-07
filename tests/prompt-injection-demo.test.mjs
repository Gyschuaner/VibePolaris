import test from "node:test";
import assert from "node:assert/strict";

import { getPromptInjectionDemoState } from "../lib/prompt-injection-demo.ts";

test("网页按资料处理时，原任务完成且高风险工具不出现", () => {
  const state = getPromptInjectionDemoState(3, "data");
  assert.equal(state.summaryReady, true);
  assert.equal(state.proposed, false);
  assert.equal(state.blocked, false);
});

test("网页被误升为指令时，工具提案会在闸门处被拒绝", () => {
  const proposed = getPromptInjectionDemoState(2, "instruction");
  const blocked = getPromptInjectionDemoState(3, "instruction");
  assert.equal(proposed.proposed, true);
  assert.equal(proposed.blocked, false);
  assert.equal(blocked.blocked, true);
  assert.equal(blocked.summaryReady, false);
});
