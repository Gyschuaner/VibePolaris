import test from "node:test";
import assert from "node:assert/strict";

const { getToolResultDemoState } = await import("../lib/tool-result-demo.ts");

test("stock=0 is kept as a business result and becomes a shortage answer", () => {
  const raw = getToolResultDemoState(1, "stock0");
  assert.equal(raw.resultVisible, true);
  assert.equal(raw.validated, false);
  assert.match(raw.rawText, /stock: 0/);

  const answer = getToolResultDemoState(3, "stock0");
  assert.equal(answer.answerVisible, true);
  assert.equal(answer.answer, "K7 暂时缺货");
  assert.match(answer.status, /驱动回答/);
});

test("stock=8 changes only the business wording after validation", () => {
  const state = getToolResultDemoState(3, "stock8");
  assert.match(state.rawText, /stock: 8/);
  assert.equal(state.fieldValue, "stock: 8");
  assert.equal(state.answer, "K7 有 8 件");
});

test("timeout remains unknown instead of becoming an inventory claim", () => {
  const state = getToolResultDemoState(3, "timeout");
  assert.match(state.rawText, /status: 504/);
  assert.equal(state.answer, "K7 暂时无法确认");
  assert.match(state.status, /错误也属于结果/);
});

test("the first frame contains the request but no result or answer", () => {
  const state = getToolResultDemoState(0, "stock0");
  assert.equal(state.requestVisible, true);
  assert.equal(state.resultVisible, false);
  assert.equal(state.validated, false);
  assert.equal(state.answerVisible, false);
});
