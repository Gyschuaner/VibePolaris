import assert from "node:assert/strict";
import test from "node:test";
import {
  createHarnessState,
  harnessFrame,
  harnessReducer,
  harnessStory,
} from "../lib/harness-v4.ts";

test("V4 服务修复演示保留请求、执行、反馈和结论顺序", () => {
  const frames = harnessStory.success;
  assert.equal(frames[0].fileVisible, false);
  assert.equal(frames.findIndex((frame) => frame.title === "请求读取日志") < frames.findIndex((frame) => frame.title === "日志返回语法错误"), true);
  assert.equal(frames.at(-1).final, true);
  assert.equal(frames.at(-1).status, "已验证完成");
});

test("V4 分支分别覆盖复测和权限拒绝", () => {
  assert.equal(harnessStory.retry.at(-1).status, "修正后通过");
  assert.equal(harnessStory.retry.some((frame) => frame.title === "接口仍返回错误"), true);
  assert.equal(harnessStory.denied.some((frame) => frame.denied), true);
  assert.equal(harnessStory.denied.at(-1).status, "等待授权");
});

test("模式、播放和边界动作保持可预测", () => {
  let state = createHarnessState();
  state = harnessReducer(state, { type: "play", reduced: true });
  assert.equal(state.step, harnessStory.success.length - 1);
  assert.equal(state.playing, false);
  state = harnessReducer(createHarnessState(), { type: "mode", value: "model" });
  assert.equal(harnessReducer(state, { type: "play" }), state);
  assert.equal(harnessFrame(harnessReducer(createHarnessState(), { type: "next" })).title, "请求读取日志");
});

test("回复输出完成前，手动和自动播放都不能进入工具执行", () => {
  let state = harnessReducer(createHarnessState(), { type: "play" });
  state = harnessReducer(state, { type: "tick" });
  assert.equal(state.step, 1);
  assert.equal(harnessReducer(state, { type: "next" }), state);
  assert.equal(harnessReducer(state, { type: "tick" }), state);
  assert.equal(harnessReducer(state, { type: "reply-complete", step: 4 }), state);
  state = harnessReducer(state, { type: "reply-complete", step: 1 });
  assert.equal(harnessReducer(state, { type: "next" }).step, 2);
  assert.equal(harnessReducer(state, { type: "tick" }).step, 2);
  state = harnessReducer(state, { type: "reset" });
  state = harnessReducer(state, { type: "next" });
  assert.equal(state.replyComplete, false);
  assert.equal(harnessReducer(state, { type: "next" }), state);
});
