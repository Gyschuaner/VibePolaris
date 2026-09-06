import assert from "node:assert/strict";
import test from "node:test";
import { initialLesson, isSettled, lessonReducer, lessonSteps, lessonView, todoItems } from "../lib/harness-lesson.ts";

const settle = state => lessonReducer(state, { type: "settle" });
const next = state => lessonReducer(state, { type: "next", reduced: false });

test("读取与回传按先后发生，模型不会提前知道文件内容", () => {
  let state = initialLesson;
  assert.equal(lessonView(state).fileRead, false);
  for (let step = 1; step <= 3; step++) state = next(settle(state));
  assert.equal(lessonView(state).fileRead, false);
  state = lessonReducer(state, { type: "tick", revision: state.revision });
  assert.equal(lessonView(state).fileRead, true);
  assert.equal(lessonView(state).toolReturned, false);
  state = lessonReducer(state, { type: "tick", revision: state.revision });
  assert.equal(lessonView(state).toolReturned, true);
  assert.equal(lessonView(state).modelHasFile, false);
  state = next(settle(state));
  assert.equal(lessonView(state).modelHasFile, false);
  state = lessonReducer(state, { type: "tick", revision: state.revision });
  assert.equal(lessonView(state).modelHasFile, true);
  assert.equal(lessonView(state).answered, false);
});

test("快速点击不会跳步，回退和重播会让旧定时事件失效", () => {
  const active = next(initialLesson);
  assert.deepEqual(next(active), active);
  const previous = lessonReducer(active, { type: "previous" });
  assert.equal(previous.step, 0);
  assert.deepEqual(lessonReducer(previous, { type: "tick", revision: active.revision }), previous);
  const replayed = lessonReducer(active, { type: "replay" });
  assert.deepEqual(lessonReducer(replayed, { type: "tick", revision: active.revision }), replayed);
  assert.deepEqual(lessonView(replayed), lessonView(initialLesson));
});

test("六步完整运行到回答，前后边界稳定，数据保持只读", () => {
  let state = initialLesson;
  assert.deepEqual(lessonReducer(state, { type: "previous" }), state);
  for (let i = 1; i < lessonSteps.length; i++) state = settle(next(state));
  assert.equal(state.step, 5);
  assert.equal(lessonView(state).answered, true);
  assert.deepEqual(next(state), state);
  state = lessonReducer(state, { type: "previous" });
  assert.equal(lessonView(state).answered, false);
  assert.deepEqual(todoItems.filter(item => !item.done).map(item => item.text), ["寄快递", "给绿植浇水"]);
});

test("减少动态效果保持手动六步，不跳过教学内容", () => {
  let state = initialLesson;
  for (let i = 1; i < 6; i++) {
    state = lessonReducer(state, { type: "next", reduced: true });
    assert.equal(state.step, i);
    assert.equal(isSettled(state), true);
  }
});
